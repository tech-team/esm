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
        this.q = q;
        this.children = {};
    }

    addChild(node, op, value) {
        this.children[node.q.param] = [{
            bond: new Bond(op, value),
            node: node
        }];
    }
}

class OrderRulesGraph {
    constructor(questions) {
        var self = this;
        this.nodes = {};
        this.freeNodes = {};

        _.forEach(questions, function(q) {
            var node = new Node(q);
            self.nodes[q.param] = node;
            self.freeNodes[q.param] = node;
        });
    }

    addConnection(fromQ, toQ, op, value) {
        var fromNode = this.nodes[fromQ.param];
        var toNode = this.nodes[toQ.param];

        if (_.has(fromNode.children, toNode.q.param)) {
            var childsForToNode = fromNode.children[toNode.q.param];
            var foundChild = _.find(childsForToNode, function(child) {
                return child.bond.op == op && child.bond.value == value;
            });

            if (!foundChild) {
                childsForToNode.push({
                    bond: new Bond(op, value),
                    node: toNode
                });
            }
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