/**
 * Полифил функции sleep()
 *
 * @param  {Number} ms Время в ms
 * @return {[type]}    [description]
 */
module.exports = ms => new Promise(resolve => setTimeout(resolve, ms));
