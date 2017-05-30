module.exports = {
  press: window.ontouchend === undefined ? 'click' : 'touchend'
}
