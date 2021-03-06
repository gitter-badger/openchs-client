class Wizard {
    constructor(numberOfPages, formStartsAt) {
        this.numberOfPages = numberOfPages;
        this.formStartsAt = formStartsAt;
        this.currentPage = 1;
    }

    clone() {
        const wizard = new Wizard(this.numberOfPages, this.formStartsAt);
        wizard.currentPage = this.currentPage;
        return wizard;
    }

    moveNext() {
        if (this.isLastPage()) {
            throw Error('Already on the last page');
        }
        this.currentPage = this.currentPage + 1;
    }

    movePrevious() {
        if (this.currentPage === 1) {
            throw Error('Already on the first page');
        }
        this.currentPage = this.currentPage - 1;
    }

    isFirstFormPage() {
        return this.currentPage === this.formStartsAt;
    }

    isNonFormPage() {
        return this.currentPage < this.formStartsAt;
    }

    isLastPage() {
        return this.numberOfPages === this.currentPage;
    }

    isFirstPage() {
        return this.currentPage === 1;
    }
}

export default Wizard;