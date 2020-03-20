+++
title = "Handling forms"
date =  2020-03-20T13:18:11+01:00
weight = 5
+++

# Handling forms
Filling forms and verifying their functionality is one of the major use cases in E2E-Testing and -Monitoring. Most of the web element have been abstracted from their technical specification in HTML. A `<intput name="last-name" /> ` for example is abstracted as a via the `_textbox("last-name")` accessor. Let's have a look at some more of the most common accessors to interact with forms.

## Input fields

### Textarea
Filling text into a textarea can easily be achieved by combining the [_setValue() action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_setvalue) with the [_textarea() accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_textarea).

{{<highlight html>}}
<textarea name="textarea-input" ></textarea>
{{</highlight>}}

{{<highlight javascript>}}
await _setValue(_textarea('textarea-input'), 'Some longer text maybe...')
{{</highlight>}}

### Textboxes
Similar to `<textarea>` elements, text input fields can easily be filled with text by combining the [_setValue() action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_setvalue) with the [_textbox() accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_textbox). The `_textbox()` accessor is configured to catch `<input>` fields without any `type` or with `type=text`. 

{{<highlight html>}}
<input type="text" name="first-name" />
<input name="last-name" />
<input id="Street" />
{{</highlight>}}

{{<highlight javascript>}}
await _setValue(_textbox('first-name') ,"Bill")
await _setValue(_textbox('last-name') ,"Jobs")
await _setValue(_textbox('street') ,"Money Blvd.")
{{</highlight>}}


### Emails
Similar to `<input type="text">` elements, E-Mail input fields can easily be filled with an E-Mail address by combining the [_setValue() action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_setvalue) with the [_emailbox() accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_emailbox). The `_emailbox()` accessor is configured to catch `<input>` fields or with `type=email`. 

{{<highlight html>}}
<input type="email" name="mail-input" />
{{</highlight>}}

{{<highlight javascript>}}
await _setValue(_emailbox('mail-input'), 'do-not-spam@sakuli.io')
{{</highlight>}}


### Passwords

### Dates

#### all the other stuff

#### monthboxes

#### timebox

#### weekbox

### searchfields

### Numberboxes

### telephoneboxes


## Buttons

### Standard
https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_button

### Submit buttons

#### with images

#### standard

## Checkboxes

## File uploads

## Select boxes
- select
- option

## Radiobuttons

## Rangeboxes and sliders

## Resetbuttons

## Froms with custom HTML Tags 