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
        this.parents = [];
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
        if (!_.includes(node.parents, this)) {
            node.parents.push(this);
        }
    }
}

class OrderRulesGraph {
    constructor(questions) {
        var self = this;
        this.nodes = {};
        this.freeNodes = {};
        this.currentNode = null;

        _.forEach(questions, function(q) {
            var node = new Node(q);
            self.nodes[q.param] = node;
            self.freeNodes[q.param] = node;
        });
    }

    checkCyclic(fromNode, toNode) {
        if (fromNode == toNode) {
            return true;
        }

        var ans = false;
        for (var i = 0; i < fromNode.parents; ++i) {
            var p = fromNode.parents[i];
            ans = checkCyclic(p, toNode);
            if (ans) break;
        }
        return ans;
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

    next() {
        if (this.currentNode == null) {
            this.currentNode = this.freeNodes[_.keys(this.freeNodes)[0]];
        } else {

        }

        return this.currentNode.q;
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

    nn(orderRules, currentQuestion, user_ans, questions) {
        var orderRule = _.find(orderRules, function(orderRule) {
            if (currentQuestion.type == 'choice' && orderRule.value == user_ans) {
                return true;
            } else if (currentQuestion.type == 'number') {
                switch (orderRule.op) {
                    case '==':
                        return user_ans == orderRule.value;
                    case '<':
                        return user_ans < orderRule.value;
                    case '>':
                        return user_ans > orderRule.value;
                    case '<=':
                        return user_ans <= orderRule.value;
                    case '>=':
                        return user_ans >= orderRule.value;
                }
            }
        });

        var nextQuestion = _.find(questions, function(q) {
            return q.param == orderRule.to;
        });

        return nextQuestion;
    }
}

module.exports = OrderRulesGraph;