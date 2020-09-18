export default class MessageBoxManager {
    static init() {
        this.msgBox = document.getElementById("messagebox");
    }

    static clear() {
        this.msgBox.classList.remove(...this.msgBox.classList);
    }

    static info(msg) {
        this.clear();
        this.show();
        this.msgBox.classList.add("alert", "alert-info");
        this.msgBox.innerText = msg;
    }

    static success(msg) {
        this.clear();
        this.show();
        this.msgBox.classList.add("alert", "alert-success");
        this.msgBox.innerText = msg;
    }

    static danger(msg) {
        this.clear();
        this.show();
        this.msgBox.classList.add("alert", "alert-danger");
        this.msgBox.innerText = msg;
    }

    static show() {
        this.msgBox.classList.remove("d-none");
    }

    static hide() {
        this.msgBox.classList.add("d-none");
    }
}