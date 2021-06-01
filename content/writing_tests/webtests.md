---
title : "Webtests"
date :  2019-09-12T13:16:37+02:00
weight : 6
---

# Web tests

For DOM based testing most of the functions from
<a href="https://sahipro.com/docs/sahi-apis/" target="_blank">Sahi tests</a> can be used (please note that Sakuli only
implements the open source APIs).

The main difference between Sakuli v1 and Sakuli v2 is the usage of
<a href="https://developers.google.com/web/fundamentals/primers/promises" target="_blank">Promises</a> in the action
API, meaning that you have to `await` a click for example.

On the other hand, element selectors remain synchronized functions but will not do the actual DOM fetching anymore.
While an expression like `var $e=_link('Sakuli')` did an actual DOM-access in Sakuli v1.x, it returns a kind of abstract
query for an element now. So, action can fetch this element whenever it is required.

A detailed list of all available functions can be found in the [Legacy API interface](https://sakuli.io/apidoc/sakuli-legacy),

## Accessors

Sakuli uses the concept of reusable queries rather than directly working on an element-object (like in Selenium).
Sakuli offers an expressive set of accessors like `_div`, `_textbox` or `_table`. These accessors will not return an
actual element or any reference to it. Rather it will create a query. This query can then be used in various
[Actions](#actions) like `_click`, `_highlight` or `_isVisible`. This concept could be compared with
<a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html" target="_blank">Locators in Selenium</a>.

This architecture gives us two nice benefits:

- Compatibility with <a href="https://sahipro.com/docs/sahi-apis/index.html" target="_blank">Sahi API</a>
- Since Sakuli handles the actual fetching and validation of an element by performing retries, refreshes, implicit wait etc. which reduce annoying issues with Selenium a lot (e.g. <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/error_exports_StaleElementReferenceError.html" target="_blank">StaleElementReferenceError</a>)

Most accessors are defined in the same way: They are functions that take an[AccessorIdentifier](#identifier) as a first
parameter and a variadic list of [Relations](#relations):

{{<highlight javascript>}}
_NAME(identifier, ...relations): SahiElementQuery
{{</highlight>}}

The accessor adds a static <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html" target="_blank">Locator</a> to the returned query. Since 

a query object consists of a locator, an identifier and a list of relations, we will eventually get an entire query object. The locator basically is a CSS element selector which you would expect from the accessor name - so `_div` for example adds `By.css('div')`, `_textbox` adds `By.css('input[type="text"], input:not([type])')` and so on.


### Accessors by HTML-Tag or attributes

| HTML-Tag | Accessor Function |
|:---|:---|
| [`<a>`](http://www.w3schools.com/TAGs/tag_a.asp) | [_link](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_link)
| [`<area>`](https://www.w3schools.com/TAGs/tag_area.asp) | [_area](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_area)
| [`<article>`](https://www.w3schools.com/TAGs/tag_article.asp) | [_article](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_article)
| [`<aside>`](https://www.w3schools.com/TAGs/tag_aside.asp) | [_aside](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_aside)
| [`<blockquote>`](https://www.w3schools.com/TAGs/tag_blockquote.asp) | [_blockquote](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_blockquote)
| [`<b>`](https://www.w3schools.com/TAGs/tag_b.asp) | [_bold](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_bold)
| [`<button>`](https://www.w3schools.com/TAGs/tag_button.asp) | [_button](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_button)
| [`<button type="`**`reset`**`">`](https://www.w3schools.com/tags/att_button_type.asp) | [_reset](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_reset)
| [`<button type="`**`submit`**`">`](https://www.w3schools.com/tags/att_button_type.asp) | [_submit](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_submit) 
| [`<canvas>`](https://www.w3schools.com/TAGs/tag_canvas.asp) | [_canvas](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_canvas)
| [`<code>`](https://www.w3schools.com/TAGs/tag_code.asp) | [_code](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_code)
| [`<dd>`](https://www.w3schools.com/TAGs/tag_dd.asp) | [_dDesc](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_ddesc)
| [`<details>`](https://www.w3schools.com/TAGs/tag_details.asp) | [_details](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_details)
| [`<div>`](https://www.w3schools.com/TAGs/tag_div.asp) | [_div](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_div)
| [`<dl>`](https://www.w3schools.com/TAGs/tag_dl.asp) | [_dList](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_dlist)
| [`<dt>`](https://www.w3schools.com/TAGs/tag_dt.asp) | [_dTerm](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_dterm)
| [`<em>`](http://www.w3schools.com/TAGs/tag_em.asp) | [_emphasis](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_emphasis) 
| [`<embed>`](http://www.w3schools.com/TAGs/tag_embed.asp) | [_embed](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_embed)
| [`<fieldset>`](https://www.w3schools.com/tags/tag_fieldset.asp) | [_fieldset](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_fieldset) 
| [`<figcaption>`](https://www.w3schools.com/tags/tag_figcaption.asp) | [_figcaption](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_figcaption) 
| [`<figure>`](http://www.w3schools.com/TAGs/tag_figure.asp) | [_figure](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_figure) 
| [`<font>`](http://www.w3schools.com/TAGs/tag_font.asp) | [_font](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_font)  
| [`<footer>`](http://www.w3schools.com/TAGs/tag_footer.asp) | [_footer](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_footer) 
| [`<frame>`](http://www.w3schools.com/TAGs/tag_frame.asp) | [_frame](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_frame)
| [`<header>`](http://www.w3schools.com/TAGs/tag_header.asp) | [_header](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_header) 
| [`<hr>`](http://www.w3schools.com/TAGs/tag_hr.asp) | [_hr](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_hr)
| [`<h1>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading1](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_heading1)
| [`<h2>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading2](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_heading2)
| [`<h3>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading3](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_heading3) 
| [`<h4>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading4](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_heading4)
| [`<h5>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading5](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_heading5)
| [`<h6>`](http://www.w3schools.com/TAGs/tag_hn.asp) | [_heading6](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_heading6) 
| [`<i>`](http://www.w3schools.com/TAGs/tag_i.asp) | [_italic](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_italic) 
| [`<iframe>`](http://www.w3schools.com/TAGs/tag_iframe.asp) | [_iframe](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_iframe) 
| [`<iframe>`](http://www.w3schools.com/TAGs/tag_iframe.asp) | [_rte](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_rte)
| [`<img>`](http://www.w3schools.com/TAGs/tag_img.asp) | [_image](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_image)
| [`<input type="`**`checkbox`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_checkbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_checkbox)
| [`<input type="`**`date`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_datebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_datebox)
| [`<input type="`**`datetime`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_datetimebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_datetimebox)
| [`<input type="`**`datetime-local`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_datetimelocalbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_datetimelocalbox)
| [`<input type="`**`email`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_emailbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_emailbox)
| [`<input type="`**`file`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_file](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_file) 
| [`<input type="`**`hidden`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_hidden](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_hidden) 
| [`<input type="`**`image`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_imageSubmitButton](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_imagesubmitbutton) 
| [`<input type="`**`month`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_monthbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_monthbox) 
| [`<input type="`**`number`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_numberbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_numberbox)
| [`<input type="`**`password`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_password](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_password) 
| [`<input type="`**`radio`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_radio](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_radio)
| [`<input type`**`range`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_rangebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_rangebox) 
| [`<input type="`**`search`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_searchbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_searchbox)  
| [`<input type="`**`tel`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_telephonebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_telephonebox) 
| [`<input type="`**`text`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_textbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_textbox)
| [`<input type="`**`time`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_timebox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_timebox)
| [`<input type="`**`url`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_urlbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_urlbox) 
| [`<input type="`**`week`**`"/>`](https://www.w3schools.com/html/html_form_input_types.asp) | [_weekbox](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_weekbox) 
| [`<label>`](http://www.w3schools.com/TAGs/tag_label.asp) | [_label](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_label) 
| [`<main>`](http://www.w3schools.com/TAGs/tag_main.asp) | [_main](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_main)
| [`<map>`](http://www.w3schools.com/TAGs/tag_map.asp) | [_map](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_map) 
| [`<mark>`](http://www.w3schools.com/TAGs/tag_mark.asp) | [_mark](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_mark)  
| [`<nav>`](http://www.w3schools.com/TAGs/tag_nav.asp) | [_nav](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_nav) 
| [`<object>`](http://www.w3schools.com/TAGs/tag_object.asp) | [_object](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_object)
| [`<p>`](http://www.w3schools.com/TAGs/tag_p.asp) | [_paragraph](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_paragraph) 
| [`<pre>`](http://www.w3schools.com/TAGs/tag_pre.asp) | [_performatted](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_performatted) 
| [`<section>`](http://www.w3schools.com/TAGs/tag_section.asp) | [_section](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_section) 
| [`<select>`](http://www.w3schools.com/TAGs/tag_select.asp) | [_option](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_option) 
| [`<select>`](http://www.w3schools.com/TAGs/tag_select.asp) | [_select](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_select) 
| [`<span>`](http://www.w3schools.com/TAGs/tag_span.asp) | [_span](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_span) 
| [`<strong>`](http://www.w3schools.com/TAGs/tag_strong.asp) | [_strong](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_strong) 
| [`<summary>`](http://www.w3schools.com/TAGs/tag_summary.asp) | [_summary](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_summary)  
| [`<ellipse/>`](https://www.w3schools.com/graphics/svg_ellipse.asp) | [_svg_ellipse](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_ellipse) 
| [`<circle/>`](https://www.w3schools.com/graphics/svg_circle.asp) | [_svg_circle](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_circle)
| [`<line/>`](https://www.w3schools.com/graphics/svg_line.asp) | [_svg_line](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_line) 
| [`<path/>`](https://www.w3schools.com/graphics/svg_path.asp) | [_svg_path](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_path) 
| [`<polygon/>`](https://www.w3schools.com/graphics/svg_polygon.asp) | [_svg_polygon](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_polygon)
| [`<polyline/>`](https://www.w3schools.com/graphics/svg_polyline.asp) | [_svg_polyline](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_polyline)  
| [`<rect/>`](https://www.w3schools.com/graphics/svg_rect.asp) | [_svg_rect](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_rect)
| [`<text>`](https://www.w3schools.com/graphics/svg_text.asp) | [_svg_text](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_text) 
| [`<tspan>`](https://www.w3schools.com/graphics/svg_reference.asp) | [_svg_tspan](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_svg_tspan)  
| [`<table>`](http://www.w3schools.com/TAGs/tag_table.asp) | [_table](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_table) 
| [`<td>`](https://www.w3schools.com/TAGs/tag_td.asp) | [_cell](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_cell)
| [`<textarea type="text"/>`](https://www.w3schools.com/tags/tag_textarea.asp) | [_textarea](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_textarea)  
| [`<time>`](http://www.w3schools.com/TAGs/tag_time.asp) | [_time](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_time)  
| [`<th>`](http://www.w3schools.com/TAGs/tag_th.asp) | [_tableHeader](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_tableheader)  
| [`<tr>`](http://www.w3schools.com/TAGs/tag_tr.asp) | [_row](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_row)  
| [`<ul>`](http://www.w3schools.com/TAGs/tag_ul.asp) | [_list](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_list) 
| [`<li>`](https://www.w3schools.com/tags/tag_li.asp) | [_listItem](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_listitem) 
| [`<video>`](http://www.w3schools.com/TAGs/tag_video.asp) | [_video](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_video)  

| HTML-Attribute | Accessor Function |
|:---|:---|
| [`<[HTML - tag] class='[`**`class name`**`]'></[HTML - tag]>`](https://www.w3schools.com/html/html_classes.asp) | [_byClassName](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_byclassname)
| [`<[HTML - tag] id='[`**`id name`**`]'></[HTML - tag]>`](https://www.w3schools.com/html/html_id.asp) | [_byID](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_byid)

## ElementQueries

Since Sakuli encapsulates the creation (through accessors) and the application (e.g. through actions) of a query, a user
will rarely get in touch with these objects directly. Nevertheless, it is good to understand how Sakuli works with
queries. Let us consider this example:

{{<highlight javascript>}}
await _click(_button('Sign In'));
{{</highlight>}}

The following will happen under the hood:

1. `_button` creates a query with a locator to a button element and with `'Sign In'` as an identifier and an empty list of relations

2. This query is passed to the `_click` action. This action does the following things:
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

> Since we mostly apply the logic of Sahi comparisons against the class attribute are pretty dumb. While the attribute value is semantically a space separated list of class names. It is just handled as a usual string in Sahi (and therefore also in Sakuli so far).

## Actions

Actions usually invoke a <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/input_exports_Actions.html" target="_blank">Selenium action sequence</a>
with an activated bridge mode to cover compatibility to most webdriver implementations. An action accepts a
[ElementQuery or a WebElement](#ElementQueries) and tries to perform the action on this element several times.
This approach reduces the count of StaleElementReferenceErrors dramatically, especially when a query is used.

### _eval

Beside the fact that actions work asynchronously now, they behave like in Sahi. One exception is the [`_eval`](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_eval) method, which accepts a string now containing some JavaScript code, which is performed on the website by the webdriver implementation (see `executeAsyncScript` method of 
 <a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html" target="_blank">Seleniums Thenablewebdriver</a>).

{{<highlight javascript>}}
const windowOuterHeight = await _eval(`return window.outerHeight`)
{{</highlight>}}

### List of available actions

- [_eval](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_eval)
- [_highlight](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_highlight)
- [_navigateTo](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_navigateto)
- [_wait](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_wait)
- [_pageIsStable](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_pageisstable)
- [_blur](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_blur)
- [_focus](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_focus)
- [_click](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_click)
- [_rightClick](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_rightclick)
- [_mouseDown](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_mousedown)
- [_mouseUp](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_mouseup)
- [_mouseOver](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_mouseover)
- [_check](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_check)
- [_uncheck](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_uncheck)
- [_setSelected](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_setselected)
- [_dragDrop](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_dragdrop)
- [_dragDropXY](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_dragdropxy)

## Fetching Elements

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

List of fetch functions:
- [_collect](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_collect)
- [_count](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_count)
- [_fetch](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_fetch)
- [_getValue](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_getvalue)
- [_getText](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_gettext)
- [_getOptions](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_getoptions)
- [_getCellText](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_getcelltext)
- [_getSelectedText](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_getselectedtext)
- [_getAttribute](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_getattribute)
- [_exists](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_exists)
- [_areEqual](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_areequal)
- [_isVisible](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_isvisible)
- [_isChecked](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_ischecked)
- [_isEnabled](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_isenabled)
- [_containsText](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_containstext)
- [_containsHTML](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_containshtml)
- [_contains](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_contains)
- [_title](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_title)
- [_style](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_style)
- [_position](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_position)
- [_getSelectionText](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_getselectiontext)


## Relations
List of relations:
- [_parentNode](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_parentnode)
- [_parentCell](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_parentcell)
- [_parentRow](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_parentrow)
- [_parentTable](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_parenttable)
- [_in](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_in)
- [_near](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_near)
- [_rightOf](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_rightof)
- [_leftOf](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_leftof)
- [_leftOrRightOf](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_leftorrightof)
- [_under](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_under)
- [_above](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_above)
- [_underOrAbove](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_underorabove)

## Assertions
List of assertion functions:
- [_assert](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assert)
- [_assertTrue](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_asserttrue)
- [_assertFalse](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertfalse)
- [_assertNotTrue](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertnottrue)
- [_assertContainsText](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertcontainstext)
- [_assertNotContainsText](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertnotcontainstext)
- [_assertEqual](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertequal)
- [_assertNotEqual](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertnotequal)
- [_assertEqualArrays](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertequalarrays)
- [_assertExists](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertexists)
- [_assertNotExists](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertnotexists)
- [_assertNotNull](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertnotnull)
- [_assertNull](https://sakuli.io/apidoc/sakuli-legacy/interfaces/legacyapi.html#_assertnull)


## Selenium Fallbacks

Since Sakuli uses <a href="https://www.npmjs.com/package/selenium-webdriver" target="_blank">Seleniums webdriver</a> it also provides various ways to access the functionality of this backend.

> It is recommended to use Sakulis built-in functionalities rather than work with the driver instances or any WebElement directly.
> At the moment, Sakuli is built upon Selenium. Nevertheless, a switch to other technologies in the future is possible.
> Downwards compatibility is only possible for Sakulis built-in functionalities. Direct use of webdriver instance methods is not supported.

### WebDriver instance

Sakuli test scripts provide a globally accessible object of the current
<a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html" target="_blank">WebDriver instance</a>
which can be used to invoke its native methods directly. This might be useful for switching between frames:

{{<highlight javascript>}}
await driver.switchTo().frame(1);
await _click(_div('element-in-frame-1'));
await driver.switchTo().defaultContent();
{{</highlight>}}

### WebElement instances

The Fetch API provides the `_fetch` function which returns the native
<a href="https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html" target="_blank">WebElement</a>
instance from Seleniums webdriver for a query:

{{<highlight javascript>}}
const webElement = await _fetch(_image('funny-cat-image.png')); 
const {width, height} = await webElement.getRect();
{{</highlight>}}
