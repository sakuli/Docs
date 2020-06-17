---
title : "Webtests"
date :  2019-09-12T13:16:37+02:00
weight : 6
---

# Web tests

For DOM based testing most of the functions from <a href="https://sahipro.com/docs/sahi-apis/" target="_blank">Sahi tests</a> can be used (please note that Sakuli only implements the open source APIs).

The main difference between Sakuli v1 and Sakuli v2 is the usage of <a href="https://developers.google.com/web/fundamentals/primers/promises" target="_blank">Promises</a> in the action API, meaning that you have to `await` a click for example.

On the other hand, element selectors remain synchronized functions but will not do the actual DOM fetching anymore. While an expression like `var $e=_link('Sakuli')` did an actual DOM-access in Sakuli v1.x, it returns a kind of abstract query for an element now. So, action can fetch this element whenever it is required.

A detailed list of all available functions can be found in the [Sahi API interface](/apidoc/sakuli-legacy/interfaces/sahiapi.html),

## Accessor API

The Accessor API is described in the [Accessor API interface](/apidoc/sakuli-legacy/interfaces/accessorapi.html).

Sakuli uses the concept of reusable [Queries](/apidoc/sakuli-legacy/interfaces/sahielementquery.html) rather than directly working on an element-object (like in Selenium). Sakuli offers an expressive set of [Accessors](/apidoc/sakuli-legacy/interfaces/accessorapi.html) like `_div`, `_textbox` or `_table`. These accessors will not return an actual element or any reference to it. Rather it will create a [SahiElementQuery](/apidoc/sakuli-legacy/interfaces/sahielementquery.html). This query can then be used in various [Actions](#action-api) like `_click`, `_highlight` or `_isVisible`. This concept could be compared with <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html" target="_blank">Locators in Selenium</a>.

This architecture gives us two nice benefits:

- Compatibility with <a href="https://sahipro.com/docs/sahi-apis/index.html" target="_blank">Sahi API</a>
- Since Sakuli handles the actual fetching and validation of an element by performing retries, refreshes, implicit wait etc. which reduce annoying issues with Selenium a lot (e.g. <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/error_exports_StaleElementReferenceError.html" target="_blank">StaleElementReferenceError</a>)

Most accessors are defined in the same way: They are functions that take an [AccessorIdentifier](/apidoc/sakuli-legacy/globals.html#accessoridentifier) as a first parameter and a variadic list of [Relations](/apidoc/sakuli-legacy/interfaces/relationapi.html):

{{<highlight javascript>}}
_NAME(identifier, ...relations): SahiElementQuery
{{</highlight>}}

The accessor adds a static <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html" target="_blank">Locator</a> to the returned query. Since 

a query object consists of a locator, an identifier and a list of relations, we will eventually get an entire query object. The locator basically is a CSS element selector which you would expect from the accessor name - so `_div` for example adds `By.css('div')`, `_textbox` adds `By.css('input[type="text"], input:not([type])')` and so on.

### Accessors by HTML-Tag

| HTML-Tag | Accessor Function |
|:---|:---|
| [`<area>`](https://www.w3schools.com/TAGs/tag_area.asp) | [_area](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_area)
| [`<article></article>`](https://www.w3schools.com/TAGs/tag_article.asp) | [_article](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_article)
| [`<aside></aside>`](https://www.w3schools.com/TAGs/tag_aside.asp) | [_aside](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_aside)
| [`<blockquote>[qquote]</blockquote>`](https://www.w3schools.com/TAGs/tag_blockquote.asp) | [_blockquote](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_blockquote)
| [`<b></b>`](https://www.w3schools.com/TAGs/tag_b.asp) | [_bold](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_bold)
| [`<button></button>`](https://www.w3schools.com/TAGs/tag_button.asp) | [_button](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_button)
| [`<[HTML - tag] class='[class name]'></[HTML - tag]>`](https://www.w3schools.com/html/html_classes.asp) | [_byClassName](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_byclassname)
| [`<[HTML - tag] id='[id name]'></[HTML - tag]>`](https://www.w3schools.com/html/html_id.asp) | [_byID](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_byid)
| [`<canvas></canvas>`](https://www.w3schools.com/TAGs/tag_canvas.asp) | [_canvas](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_canvas)
| [`<td></td>`](https://www.w3schools.com/TAGs/tag_td.asp) | [_cell](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_cell)
| [`<input type="`**`checkbox`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_checkbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_checkbox)
| [`<code></code>`](https://www.w3schools.com/TAGs/tag_code.asp) | [_code](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_code)
| [`<dd></dd>`](https://www.w3schools.com/TAGs/tag_dd.asp) | [_dDesc](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_ddesc)
| [`<dl></dl>`](https://www.w3schools.com/TAGs/tag_dl.asp) | [_dList](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_dlist)
| [`<dt></dt>`](https://www.w3schools.com/TAGs/tag_dt.asp) | [_dTerm](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_dterm)
| [`<input type="`**`date`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_datebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_datebox)
| [`<input type="`**`datetime`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_datetimebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_datetimebox)
| [`<input type="`**`datetime-local`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_datetimelocalbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_datetimelocalbox)
| [`<details></details>`](https://www.w3schools.com/TAGs/tag_details.asp) | [_details](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_details)
| [`<div></div>`](https://www.w3schools.com/TAGs/tag_div.asp) | [_div](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_div)
| [`<input type="`**`email`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_emailbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_emailbox)
| [`<input type="`**`week`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_weekbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_weekbox) 
| [`<video>`](http://www.w3schools.com/TAGs/tag_video.asp) | [_video](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_video) 
| [`<input type="`**`url`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_urlbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_urlbox) 
| [`<input type="`**`time`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_timebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_timebox) 
| [`<time>`](http://www.w3schools.com/TAGs/tag_time.asp) | [_time](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_time) 
| [`<input type="`**`text`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_textbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_textbox) 
| [`<textarea type="text" ... />`](https://www.w3schools.com/tags/tag_textarea.asp) | [_textarea](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_textarea) 
| [`<input type="`**`tel`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_telephonebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_telephonebox) 
| [`<th>`](http://www.w3schools.com/TAGs/tag_th.asp) | [_tableHeader](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_tableheader) 
| [`<table>`](http://www.w3schools.com/TAGs/tag_table.asp) | [_table](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_table) 
| [`<svg ...><text ...><`**`tspan`**`>hello</`**`tspan`**`></text></svg>`](https://www.w3schools.com/graphics/svg_reference.asp) | [_svg_tspan](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_tspan) 
| [`<svg ...><`**`text`**` ...>hello</`**`text`**`></svg>`](https://www.w3schools.com/graphics/svg_text.asp) | [_svg_text](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_text) 
| [`<svg ...><`**`rect`**` width="100" height="100" />`](https://www.w3schools.com/graphics/svg_rect.asp) | [_svg_rect](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_rect) 
| [`<svg ...><`**`polyline`**` points="..." /></svg>`](https://www.w3schools.com/graphics/svg_polyline.asp) | [_svg_polyline](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_polyline) 
| [`<svg ...><`**`polygon`**` points="..." /></svg>`](https://www.w3schools.com/graphics/svg_polygon.asp) | [_svg_polygon](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_polygon) 
| [`<svg ...><`**`path`**` d="" /></svg>`](https://www.w3schools.com/graphics/svg_path.asp) | [_svg_path](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_path) 
| [`<svg ...><`**`line`**` x1="0" y1="1" x2="2" y2="3" /></span>`](https://www.w3schools.com/graphics/svg_line.asp) | [_svg_line](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_line) 
| [`<svg ...><`**`ellipse`**` cx="1" cy="2" rx="3" ry="4" />`](https://www.w3schools.com/graphics/svg_ellipse.asp) | [_svg_ellipse](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_ellipse) 
| [`<svg ...><`**`circle`**` cx="1" cy="2" r="3" />`](https://www.w3schools.com/graphics/svg_circle.asp) | [_svg_circle](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_circle) 
| [`<summary>`](http://www.w3schools.com/TAGs/tag_summary.asp) | [_summary](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_summary) 
| [`<form><label><input type=... /></label><button type="`**`submit`**`">Submit</button>`](https://www.w3schools.com/tags/att_button_type.asp) | [_submit](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_submit) 
| [`<strong>`](http://www.w3schools.com/TAGs/tag_strong.asp) | [_strong](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_strong) 
| [`<span>`](http://www.w3schools.com/TAGs/tag_span.asp) | [_span](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_span) 
| [`<select>`](http://www.w3schools.com/TAGs/tag_select.asp) | [_select](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_select) 
| [`<section>`](http://www.w3schools.com/TAGs/tag_section.asp) | [_section](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_section) 
| [`<input type="`**`search`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_searchbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_searchbox) 
| [`<iframe>`](http://www.w3schools.com/TAGs/tag_iframe.asp) | [_rte](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_rte) 
| [`<tr>`](http://www.w3schools.com/TAGs/tag_tr.asp) | [_row](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_row) 
| [`<form><label><input type=... /></label><button type="`**`reset`**`">Reset</button>`](https://www.w3schools.com/tags/att_button_type.asp) | [_reset](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_reset) 
| [`<input type`**`range`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_rangebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_rangebox) 
| [`<input type="`**`radio`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_radio](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_radio) 
| [`<pre>`](http://www.w3schools.com/TAGs/tag_pre.asp) | [_performatted](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_performatted) 
| [`<input type="`**`password`**`" .../>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_password](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_password) 
| [`<p>`](http://www.w3schools.com/TAGs/tag_p.asp) | [_paragraph](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_paragraph) 
| [`<select>`](http://www.w3schools.com/TAGs/tag_select.asp) | [_option](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_option) 
| [`<object>`](http://www.w3schools.com/TAGs/tag_object.asp) | [_object](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_object) 
| [`<input type="`**`number`**`" .../>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_numberbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_numberbox) 
| [`<nav>`](http://www.w3schools.com/TAGs/tag_nav.asp) | [_nav](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_nav) 
| [`<input type="`**`month`**`" .../>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_monthbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_monthbox) 
| [`<mark>`](http://www.w3schools.com/TAGs/tag_mark.asp) | [_mark](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_mark) 
| [`<map>`](http://www.w3schools.com/TAGs/tag_map.asp) | [_map](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_map) 
| [`<main>`](http://www.w3schools.com/TAGs/tag_main.asp) | [_main](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_main) 
| [`<ul><`**`li`**`>Item</`**`li`**`></ul>`](https://www.w3schools.com/tags/tag_li.asp) | [_listItem](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_listitem) 
| [`<ul>`](http://www.w3schools.com/TAGs/tag_ul.asp) | [_list](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_list) 
| [`<a>`](http://www.w3schools.com/TAGs/tag_a.asp) | [_link](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_link) 
| [`<label>`](http://www.w3schools.com/TAGs/tag_label.asp) | [_label](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_label) 
| [`<i>`](http://www.w3schools.com/TAGs/tag_i.asp) | [_italic](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_italic) 
| [`<input type="`**`image`**`" src="..." ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_imageSubmitButton](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_imagesubmitbutton) 
| [`<img>`](http://www.w3schools.com/TAGs/tag_img.asp) | [_image](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_image) 
| [`<iframe>`](http://www.w3schools.com/TAGs/tag_iframe.asp) | [_iframe](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_iframe) 
| [`<hr>`](http://www.w3schools.com/TAGs/tag_hr.asp) | [_hr](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_hr) 
| [`<input type="`**`hidden`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_hidden](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_hidden) 
| [`<h6>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading6](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_heading6) 
| [`<h5>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading5](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_heading5) 
| [`<h4>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading4](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_heading4) 
| [`<h3>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading3](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_heading3) 
| [`<h2>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading2](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_heading2) 
| [`<h1>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading1](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_heading1) 
| [`<header>`](http://www.w3schools.com/TAGs/tag_header.asp) | [_header](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_header) 
| [`<frame>`](http://www.w3schools.com/TAGs/tag_frame.asp) | [_frame](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_frame) 
| [`<footer>`](http://www.w3schools.com/TAGs/tag_footer.asp) | [_footer](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_footer) 
| [`<font>`](http://www.w3schools.com/TAGs/tag_font.asp) | [_font](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_font) 
| [`<input type="`**`file`**`" ... />`](https://www.w3schools.com/html/html_form_input_types.asp) | [_file](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_file) 
| [`<figure>`](http://www.w3schools.com/TAGs/tag_figure.asp) | [_figure](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_figure) 
| [`<figure><img ... /><`**`figcaption`**`>Hello</`**`figcaption`**`><figure>`](https://www.w3schools.com/tags/tag_figcaption.asp) | [_figcaption](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_figcaption) 
| [`<form ...><`**`fieldset`**`>...</`**`fieldset`**`></form>`](https://www.w3schools.com/tags/tag_fieldset.asp) | [_fieldset](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_fieldset) 
| [`<em>`](http://www.w3schools.com/TAGs/tag_em.asp) | [_emphasis](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_emphasis) 
| [`<embed>`](http://www.w3schools.com/TAGs/tag_embed.asp) | [_embed](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_embed) 

## ElementQueries

Since Sakuli encapsulates the creation (through accessors) and the application (e.g. through actions) of a [SahiElementQuery](/apidoc/sakuli-legacy/interfaces/sahielementquery.html), a user will rarely get in touch with these objects directly. Nevertheless, it is good to understand how Sakuli works with queries. Let us consider this example:

{{<highlight javascript>}}
await _click(_button('Sign In'));
{{</highlight>}}

The following will happen under the hood:

1. `_button` creates a query with a locator to a button element and with `'Sign In'` as an identifier and an empty list of relations

2. This query is passed to the `_click` action. This action uses the [AccessorUtil](/apidoc/sakuli-legacy/classes/accessorutil.html) to fetch an element. It will:
   1. Fetch a list of all elements from the locator
   2. Reduce the list based on the relations (skipped when this list is empty)
   3. Reduce the list with the [identifier logic](#identifier)
   4. Return the first entry of the remaining elements list

### Identifier

The identifer is another relict from Sahi that can be one of the following types:

| Type                                                         | Effect                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `number`                                                     | The identifier is considered as index. Sakuli picks the element at this index (zero-based) in step 2.3 |
| [`RegExp`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | Tests this RegExp against the following attributes of each element in the list at step 2.1: `[aria-describedby]`, `[name]`, ` [id]`, `className`, `innerText`, `value`, `src` |
| `string`                                                     | The string is normalized and wrapped into a RegExp, therefore the same logic as for RegExp is applied |
| [`AccessorIdentifierAttributes`](/apidoc/sakuli-legacy/globals.html#accessoridentifierattributes) | This could be an object with the properties `sahiIndex` and/or `sahiIndex`, `sahiText`, `className`. The first two are handled like a number or a string identifer, respectively. The latter one works like a string identifier which only checks for the className property |

> Since we mostly apply the logic of Sahi comparisons against the class attribute are pretty dumb. While the attribute value is semantically a space separated list of class names. It is just handled as a usual string in Sahi (and therefore also in Sakuli so far).

## Action API

The Action API is described in the [Action Api interface](/apidoc/sakuli-legacy/interfaces/accessorapi.html).

Actions usually invoke a <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/input_exports_Actions.html" target="_blank">Selenium action sequence</a> with an activated bridge mode to cover compatibility to most webdriver implementations. An action accepts a [SahiElementQuery or a WebElement](/apidoc/sakuli-legacy/globals.html#sahielementqueryorwebelement) and tries to perform the action on this element several times. This approach reduces the count of StaleElementReferenceErrors dramatically, especially when a query is used.

### _eval

Beside the fact that actions work asynchronously now, they behave like in Sahi. One exception is the [`_eval`](/apidoc/sakuli-legacy/interfaces/actionapi.html#_eval) method, which accepts a string now containing some JavaScript code, which is performed on the website by the webdriver implementation (see `executeAsyncScript` method of 
 <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html" target="_blank">Seleniums Thenablewebdriver</a>).

{{<highlight javascript>}}
const windowOuterHeight = await _eval(`return window.outerHeight`)
{{</highlight>}}

## Fetch API

The Fetch API is described in the [Fetch API interface](/apidoc/sakuli-legacy/interfaces/fetchapi.html).

These methods are useful to get deeper access to elements and element-attributes:

{{<highlight javascript>}}
const [x,y] = await _position(_image('funny-cat-image.png'));
{{</highlight>}}

or let you perform checks (e.g. if an element exists).

{{<highlight javascript>}}
if(await _exists(_div('cookie-banner'))) {
    await _click(_button('I agree'))
}
{{</highlight>}}

## Selenium Fallbacks

Since Sakuli uses <a href="https://www.npmjs.com/package/selenium-webdriver" target="_blank">Seleniums webdriver</a> it also provides various ways to access the functionality of this backend.

> It is recommended to use Sakulis built-in functionalities rather than work with the driver instances or any WebElement directly. At the moment, Sakuli is built upon Selenium. Nevertheless, a switch to other technologies in the future is possible. Downwards compatibility is only possible for Sakulis built-in functionalities. Direct use of webdriver instance methods is not supported.

### WebDriver instance

Sakuli test scripts provide a globally accessible object of the current <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html" target="_blank">WebDriver instance</a> which can be used to invoke its native methods directly. This might be useful for switching between frames:

{{<highlight javascript>}}
await driver.switchTo().frame(1);
await _click(_div('element-in-frame-1'));
await driver.switchTo().defaultContent();
{{</highlight>}}

### WebElement instances

The Fetch API provides the `_fetch` function which returns the native <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html" target="_blank">WebElement</a> instance from Seleniums webdriver for a query:

{{<highlight javascript>}}
const webElement = await _fetch(_image('funny-cat-image.png')); 
const {width, height} = await webElement.getRect();
{{</highlight>}}
