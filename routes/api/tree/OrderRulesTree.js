"use strict";

var _ = require("lodash");

class Bond {
    constructor(op, value) {
        this.op = op || null;
        this.value = value || null;
    }
}

class Node {
    constructor(q) {
        //this.parents = [];
        this.q = q;
        this.children = {};
        this.asked = false;
    }

    addChild(node, op, value) {
        if (!_.has(this.children, node.q.param)) {
            this.children[node.q.param] = [];
        }
        this.children[node.q.param].push({
            bond: new Bond(op, value),
            node: node
        });
    }
}

class OrderRulesGraph {
    constructor(questions) {
        var self = this;
        this.nodes = {};
        this.freeNodes = {};
        this.currentNode = null;
        this.currentFreeNode = 0;
        this.freeNodesKeys = null;

        _.forEach(questions, function(q) {
            var node = new Node(q);
            self.nodes[q.param] = node;
            self.freeNodes[q.param] = node;
        });
    }

    checkCyclic(fromNode, toNode) {
        var n = this.dfs(toNode, function(n) {
            return n == fromNode;
        });
        return n != null;
    }

    addConnection(fromQ, toQ, op, value) {
        var fromNode = this.nodes[fromQ.param];
        var toNode = this.nodes[toQ.param];

        var addNode = function() {
            if (!this.checkCyclic(fromNode, toNode)) {

                fromNode.addChild(toNode, op, value);
                if (_.has(this.freeNodes, toNode.q.param)) {
                    delete this.freeNodes[toNode.q.param];
                }

            }
        }.bind(this);

        if (_.has(fromNode.children, toNode.q.param)) {
            var childsForToNode = fromNode.children[toNode.q.param];
            var foundChild = _.find(childsForToNode, function(child) {
                return child.bond.op == op && child.bond.value == value;
            });

            if (!foundChild) {
                addNode();
            }
        } else {
            addNode();
        }
    }

    getNextFreeNode() {
        if (!this.freeNodesKeys) {
            this.freeNodesKeys = _.keys(this.freeNodes);
        }
        if (this.currentFreeNode < this.freeNodesKeys.length) {
            return this.freeNodes[this.freeNodesKeys[this.currentFreeNode++]];
        }
        return null;
    }

    next(userAns) {
        if (this.currentNode == null) {
            this.currentNode = this.getNextFreeNode();
        } else {
            var suitableChild = null;
            _.forEach(this.currentNode.children, function(childArr, param) {
                _.forEach(childArr, function(child) {
                    var isSuitable = false;
                    switch (child.bond.op) {
                        case '==':
                            isSuitable = userAns == child.bond.value; break;
                        case '<':
                            isSuitable = userAns < child.bond.value;  break;
                        case '>':
                            isSuitable = userAns > child.bond.value;  break;
                        case '<=':
                            isSuitable = userAns <= child.bond.value; break;
                        case '>=':
                            isSuitable = userAns >= child.bond.value; break;
                    }

                    if (isSuitable) {
                        suitableChild = child.node;
                        return false;
                    }
                });

            });

            if (suitableChild) {
                this.currentNode = suitableChild;
            } else {
                this.currentNode = this.getNextFreeNode();
            }
        }

        if (this.currentNode) {
            this.currentNode.asked = true;
            return this.currentNode.q;
        } else {
            return null;
        }
    }

    dfs(node, pred) {
        if (node && pred(node)) {
            return node;
        }

        for (var i = 0; i < node.children.length; ++i) {
            var v = dfs(node.children[i].node, pred);
            if (v && pred(v)) {
                return v;
            }
        }
        return null;
    }
}

module.exports = OrderRulesGraph;