var BooleanLiteral = require('./booleanliteral.js');
var StringLiteral = require('./stringliteral.js');

var IfElseStatements = (function () {
    function IfElseStatements(conditionals, bodies, elseBody) {
        this.conditionals = conditionals;
        this.bodies = bodies;
        this.elseBody = elseBody;
    }

    IfElseStatements.prototype.toString = function() {
        var strings = [];
        strings.push('( if ' + '( ' + this.conditionals[0] + ' )' + ' then ' + (this.bodies[0]) + ' )');
        if (this.conditionals.length > 1) {
            for (var i = 1; i < this.conditionals.length; i++) {
                strings.push('else if ( ' + this.conditionals[i] + ' ) then ' + this.bodies[i]);
            }
        }
        if (this.elseBody) {
            strings.push('else ' + this.bodies[this.bodies.length - 1]);
        }
        return strings.join('');
    };

    IfElseStatements.prototype.analyze = function(context) {
        for (var i = 0; i < this.conditionals.length; i++) {
            this.conditionals[i].analyze(context);
        }
        // this.conditionals.analyze(context);
        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i].analyze(context);
        }
        // this.bodies.analyze(context);
        if (this.elseBody) {
            this.elseBody.analyze(context);
        }
    };
    
    IfElseStatements.prototype.optimize = function() {
        // ** conditionals are binaryExpression and will have been
        // ** analyzed by the time they get here
        var unreachableIndices = [];
        for (var i = 0; i < this.conditionals.length; i++) {
            this.conditionals[i].optimize();
            if (this.conditionals[i] instanceof BooleanLiteral) {
                if (this.conditionals[i].name === 'false') {
                    unreachableIndices.push(i);
                }
            }
        }
        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i].optimize();
        }

        // for (index of unreachableIndices) {
        //     this.conditionals[index] = new StringLiteral({ kind: 'stringlit', lexeme: '', line: 0, col: 0 });
        //     this.bodies[index] = new StringLiteral({ kind: 'stringlit', lexeme: '', line: 0, col: 0 });
        // }

        if (this.elseBody) {
            this.elseBody.optimize();
        }
        
        if (this.conditionals[0].name === 'false') {
            return this.elseBody;
        } else {
            return this;
        }
    };

    return IfElseStatements;
})();

module.exports = IfElseStatements;