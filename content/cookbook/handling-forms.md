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
Password fields are a little different compared to standard input fields as they are hiding the provided input. Sakuli provides a [_password() accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_password) to access `<input>` fields with `type=password`. In combination with the [_setValue() action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_setvalue), it is easily possible to set passwords in those fields.

{{<highlight html>}}
<input type="password" name="password-input" />
{{</highlight>}}

{{<highlight javascript>}}
await _setValue(_password('password-input'), "$ecret")
{{</highlight>}}

## Buttons
### Standard buttons
Just as for other elements, Sakuli provides a [_button accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_button). The difference to e.g. input fields is the action you perform on button elements. Instead of setting a text value you would rather click the button. To do so, Sakuli provides a [_click action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_click).

{{<highlight html>}}
<button>Click Me</button>
{{</highlight>}}

{{<highlight javascript>}}
await _click(_button('Click Me'));
{{</highlight>}} 

### Submit buttons
Submit buttons are the standard HTML way of submitting web forms. Those buttons provide specialized functionality and markup. Therefore Sakuli provides a dedicated [_submit accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_submit) looking for `<input>` elements with `type="submit"`. Such an accessor decorated with a [_click action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_click) will submit the respective web form associated with the submit button.

{{<highlight html>}}
<form>
    <label>User: <input type="text" name="username" /></label>
    <label>Password: <input type="password" name="password" /></label>
    <button type="submit">Login</button>
</form>
{{</highlight>}}

{{<highlight javascript>}}
await _click(_submit('Login'));
{{</highlight>}} 

### Buttons with images
A special kind of buttons is the image submit button that is not displayed as a regular button but represented by an image. These buttons can be accessed by the [_imageSubmitButton accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_imagesubmitbutton) which searches for `<input>` elements with `type="image"`. As these elements are still meant to be clicked, a decoration with a [_click action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_click) is possible.

{{<highlight html>}}
<form>
    <label>User: <input type="text" name="username" /></label>
    <label>Password: <input type="password" name="password" /></label>
    <input type="image" src="cool-button.png" name="login" />
</form>
{{</highlight>}}

{{<highlight javascript>}}
await _click(_imageSubmitButton('login'));
{{</highlight>}} 

## Checkboxes
As for many other HTML elements, Sakuli provides a dedicated accessor and action to handle checkbox inputs. By using the [_checkbox selector](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_checkbox) and decorating it with a [_check action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_check) you are able to check any checkbox on your website.

{{<highlight html>}}
<label>
    <input type="checkbox" name="like-pizza">
    <span>Like Pizza?</span>
</label>
{{</highlight>}}

{{<highlight javascript>}}
await _check(_checkbox('like-pizza'));
{{</highlight>}} 

## Select boxes
Selecting a specific value in select boxes is easy using the common accessor/action combination in Sakuli. To access the select box, use the [_select accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_select) in combination with the [_setSelected action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_setselected). The `_select` accessor is built to fetch `<select>` elements from the given DOM.  

{{<highlight html>}}
<select name="preferred-drink">
    <option value="water">Water</option>
    <option value="wine">Wine</option>
    <option value="beer">Beer</option>
</select>
{{</highlight>}}

{{<highlight javascript>}}
await _setSelected(_select('preferred-drink'), 'beer');
{{</highlight>}} 


## Radiobuttons
Similar to select boxes, radio buttons come with their own [_radio accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_radio) but reuse the [_click action](https://sakuli.io/apidoc/sakuli-legacy/interfaces/actionapi.html#_click). The `_radio` accessor is looking for `<input>` fields with `type=radio`.

{{<highlight html>}}
<h2>Prefered Drink?</h2>
<label>
    <span>Water</span>
    <input type="radio" name="drink" value="water" />
</label>
<label>
    <span>Wine</span>
    <input type="radio" name="drink" value="wine" />
</label>
<label>
    <span>Beer</span>
    <input type="radio" name="drink" value="beer" />
</label>  
{{</highlight>}}

{{<highlight javascript>}}
await _click(_radio(1)); // Selects 'Wine'
{{</highlight>}} 

## Access by XPath
In some cases it might be necessary to use XPath expression to navigate the DOM structure because you might use custom HTML elements or your elements do not match the criteria of Sakuli accessors. As the [_byXPath accessor](https://sakuli.io/apidoc/sakuli-legacy/interfaces/accessorapi.html#_byxpath) is just an accessor as every other, it is possible to combine it with actions.

{{<highlight html>}}
<h2>Prefered Drink?</h2>
<label>
    <span>Water</span>
    <input type="radio" name="drink" value="water" />
</label>
<label>
    <span>Wine</span>
    <input type="radio" name="drink" value="wine" />
</label>
<label>
    <span>Beer</span>
    <input type="radio" name="drink" value="beer" />
</label>  
{{</highlight>}}

{{<highlight javascript>}}
await _click(_byXPath("/html/body/label[2]/span")); // Selects 'Wine'
{{</highlight>}}  