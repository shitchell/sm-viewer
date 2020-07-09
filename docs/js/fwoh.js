/* Fit Height or Width */

var fwohSelector = "fwoh";

function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;  
}

function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function getMutationElements(mutations) {
    var mutationElements = [];

    if (isIterable(mutations)) {
        for (const mutation of mutations) {
            const node = mutation.addedNodes[0];
            if (isElement(node)) {
                mutationElements.push(node);
            }
        }
    }

    return mutationElements;
}

function resizeNode(node) {
    // Make sure node is an element
    if (isElement(node)) {
        // Get node and parent dimensions
        let nodeRect = node.getBoundingClientRect();
        let parentRect = node.parentNode.getBoundingClientRect();
        // Get node and parent aspect ratios
        let nodeAspectRatio = nodeRect.width / nodeRect.height;
        let parentAspectRatio = parentRect.width / parentRect.height;

        if (parentAspectRatio > nodeAspectRatio) {
            console.log("fwoh: Setting max width", node);
            node.style.width = "100%";
            node.style.height = "auto";
        } else {
            console.log("fwoh: Setting max height", node);
            node.style.height = "100%";
            node.style.width = "auto";
        }
    }
}

function resizeNodes(nodeList) {
    var nodes = null;
    if (nodeList == null)
    {
        nodes = document.getElementsByClassName(fwohSelector);
    } else if (isIterable(nodeList)) {
        nodes = nodeList;
    } else if (isElement(nodeList)) {
        nodes = [nodeList];
    } else {
        return null;
    }

    for (const node of nodes) {
        if (isElement(node)) {
            if (node.complete) {
                resizeNode(node);
            } else {
                node.addEventListener("load", () => resizeNode(node));
            }
        }
    }
}

// Resize nodes added to the DOM
document.addEventListener("DOMContentLoaded", function() {
    var observer = new MutationObserver(function(mutations) {
        const newElements = getMutationElements(mutations);
        resizeNodes(newElements);
    });
    observer.observe(document, {
        attributes: false,
        childList: true,
        characterData: false,
        subtree:true
    });
});
// Resize nodes whenever the screen changes size
window.addEventListener('resize', () => resizeNodes());