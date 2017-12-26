var current = 0;

(function () {
    var inputs = document.getElementsByTagName('input');
    var passContainers = [];
    for (i = 0; i < inputs.length; ++i) {
        if (inputs[i].type === "password") {
            passContainers.push(inputs[i]);
        }
    }

    for (i = 0; i < passContainers.length; ++i) {
        if (passContainers[i].type === "password") {
            passContainers[i].type = "text";
        }
    }
})();
