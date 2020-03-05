var lunrIndex, pagesIndex;

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Initialize lunrjs using our generated index file
function initLunr() {
  if (!endsWith(baseurl, "/")) {
    baseurl = baseurl + '/'
  };

  // First retrieve the index file
  $.getJSON(baseurl + "index.json")
    .done(function (index) {
      pagesIndex = index;
      // Set up lunrjs by declaring the fields we use
      // Also provide their boost level for the ranking
      lunrIndex = lunr(function () {
        this.ref("uri");
        this.field('title', {
          boost: 15
        });
        this.field('tags', {
          boost: 10
        });
        this.field("content", {
          boost: 5
        });

        // Remove stemmer and trimmer to enable matching of special characters (brackets, dots, etc.)
        this.pipeline.remove(lunr.stemmer);
        this.pipeline.remove(lunr.trimmer);
        this.searchPipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.trimmer);

        // Feed lunr with each file and let lunr actually index them
        pagesIndex.forEach(function (page) {
          this.add(page);
        }, this);
      })
    })
    .fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Error getting Hugo index file:", err);
    });
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(queryTerm) {
  const trimmedQuery = queryTerm.replace(/^\s*/, '').replace(/\s*$/, '');
  // Find the item in our index corresponding to the lunr one to have more info
  if (trimmedQuery.length) {
    return lunrIndex.search(`${trimmedQuery}^100 *${trimmedQuery}*^10`).map(function (result) {
      var matches = pagesIndex.filter(function (page) {
        return page.uri === result.ref;
      })[0];
      return Object.assign(matches, {metadata: result.matchData.metadata});
    });
  }
  return [];
}

// Let's get started
initLunr();

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
$(document).ready(function () {
  var searchList = new autoComplete({
    /* selector for the search box element */
    selector: $("#search-by").get(0),
    /* source is the callback to perform the search */
    source: function (term, response) {
      response(search(term));
    },
    /* renderItem displays individual search results */
    renderItem: function (item, term) {
      var numContextWords = 1;
      var regExpTerm = Object.keys(item.metadata || {})[0] || term; //Object.keys(item.metadata || {}).concat(term).join('|')

      var text = item.content.match(
        "(?:\\s?(?:[\\w]+)\\s?){0," + numContextWords + "}(" +
        escapeRegExp(regExpTerm) + ")(?:\\s?(?:[\\w]+)\\s?){0," + numContextWords + "}");
      item.context = (text || [])[0];
      return '<div class="autocomplete-suggestion" ' +
        'data-term="' + term + '" ' +
        'data-title="' + item.title + '" ' +
        'data-uri="' + item.uri + '" ' +
        'data-context="' + item.context + '">' +
        '» ' + item.title +
        '<div class="context">' +
        (item.context || '') + '</div>' +
        '</div>';
    },
    /* onSelect callback fires when a search suggestion is chosen */
    onSelect: function (e, term, item) {
      location.href = item.getAttribute('data-uri');
    }
  });
});
