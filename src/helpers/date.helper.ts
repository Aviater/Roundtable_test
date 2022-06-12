interface Date {
    addDays(days: number): Date;
}

// Create a helper function on the Date class prototype.
(function() {
    Date.prototype.addDays = function(this: Date, days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
})();
