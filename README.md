# Filechunk JavaScript widget

JavaScript code source for Drupal's drupal-filechunk module and Symfony's
filechunk-bundle Bundle.

Filechunk is a file uploader form widget, using JavaScript FileReader API,
sending file as chunks until upload completed. It allows complete bypass of
HTTP file upload and works well in restricted environments where upload size
is very low.

This package does not provide any server-side code, only the browser widget
JavaScript code.

## Get started

Minified distributable version of this component is provided in both:

 * https://github.com/makinacorpus/drupal-filechunk for Drupal 7;
 * https://github.com/makinacorpus/filechunk-bundle for Symfony 3.

## Implementing your own server side logic

This module requires 2 HTTP endpoints, and that you generate compatible
HTML code on page build.

### Bare minimum HTML code needed to work

```html
<div>
  <div class="filechunk-widget-table">
    <div class="filechunk-widget-row">
      <div class="filechunk-widget-drop">
        <span style="" class="text-muted message">Drag and drop files or click here…</span>
        <!-- Name attribute depends upon the underlaying framework, it can be anything -->
        <input
          data-token="wO_Ft81ye79QSfLbJD3bklxNLUelLkFcOnUXA0vlNEU"
          data-uri-upload="/system/chunk-upload"
          data-uri-remove="/system/chunk-remove"
          name="files[input]" type="file"/>
      </div>
    </div>
  </div>
  <!--
    Name attribute depends upon the underlaying framework, it can be anything,
    here, only the "rel" attribute is mandatory, and MUST contain "fid".
  -->
  <input name="file[values]" value="{&quot;1&quot;:filename,&quot;2&quot;:hash!filename}" type="hidden">
<div>
```

### Working with widget default values

### Security token

Ideally, the ``data-token`` attribute contains a random and crypto secure token
that matches both the form, and the user session, which should have a very
short lifetime. You must store all validation constraints associated to that
token on the server side and check everyone of them upon each upload endpoint
call, and during form validation as well.

### What happens at form POST

On form submisssion, posted data will be the hidden input value, no matter the
name you gave it, it will contain a JSON structure which will look like:

```json
{
  "1": {
    "filename": "some-file.png",
    "hash": null
  },
  "2": {
    "filename": "some-other-file.png",
    "hash": "some very long random hash"
  }
}
```

Where only the given ``hash`` value matters (filename is sent when the file is
being uploaded, and you should not change it using the POSTed values).

A null hash means that the file was present as a default value when the form
initially rendered, but for security reasons you obviously need to check that
when validating your form input (default file list from the initial form built
is supposedly known).

The hash is basically the file's MD5 summary, that matches the uploaded file.
Until the file is not completly uploaded, the hash is subject to change upon
every upload endpoint call.

See the next session for what to do with the hash.

### Upload endpoint

@todo document me

### Remove endpoint

@todo document me

