function matchesSelector(selector)
{
    var element = this;
    var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
    var i = 0;

    while (matches[i] && matches[i] !== element) {
        i++;
    }

    return matches[i] ? true : false;
}

if (!Element.prototype.matches && document.querySelectorAll) {
    var d = Element.prototype;
    var matches = d.matchesSelector || d.mozMatchesSelector || d.webkitMatchesSelector || d.oMatchesSelector || d.msMatchesSelector;
    Element.prototype.matches = matches || matchesSelector;
}