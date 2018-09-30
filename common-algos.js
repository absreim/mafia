const CommonAlgos = class {
    /**
     * Shuffles array in place. Fisher-Yates algo.
     * @param {Array} a An array containing the items.
     */
    static shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

module.exports = CommonAlgos