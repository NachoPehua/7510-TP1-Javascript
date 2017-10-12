function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
var Interpreter = function () {


function checkFacts(line) {
    return line.includes(":-") ;
}

function checkRule(line) {
    return line.includes(":-") ;
}


var Rule = function (name,args,factss,line) {
	this.name= name;
	this.args= args;
	this.factss=factss;
	this.origin= line;
}
var create_db = function (db,ff,rr) {
	db.map(function(x){if (!checkFacts(x)) {add_Fact(parse_fact(x))} else {add_Rule(parse_rule(x))}});
}

var parse_fact = function (line) {
	var name = line.substring(0,line.indexOf("("));
	var args = line.substring(line.indexOf("(")+1,line.indexOf(")"));
	return [name,args];
}

var add_Fact = function (fact){
	var set=false;
	for (i = 0; i < ff.length; i++) { 
    	if (ff[i].existName(fact)) {ff[i].addArgs(fact);
		set=true;			
} 
	}
	if (!set) {
	ff_names.push(fact[0]);
	ff.push(new Fact(fact[0],fact[1]))};
}

var parse_rule = function (line) {
	var aux = line.split(" :- ");
	var name = aux[0].substring(0,line.indexOf("("));
	var args = aux[0].substring(line.indexOf("(")+1,line.indexOf(")"));
	var largs = args.split(", ");
	var facts = aux[1].replace("),",")*").split("* ");
	return [name,largs,facts,line];
}

var add_Rule = function (rule){
	rr.push(new Rule(rule[0],rule[1],rule[2],rule[3]));
	rr_names.push(rule[0]);
}

this.checkQuery  = function (query){
	var pquery=parse_fact(query);
	/*contains(ff_names,pquery[0])*/
	if (contains(ff_names,pquery[0])) {return is_Fact(pquery);} else if (contains(rr_names,pquery[0])) {return is_Rule(acom_query(pquery))} else false;
}



var is_Fact = function (query){
	var valids = [];
	var out = ff.map(function (x){
		valids.push(x.equals(query));
    })
	return contains(valids,true);
}

var Fact = function (name,args) {
	this.name= name;
	this.args= [args];
}

Fact.prototype.addArgs = function(fact) {
	this.args.push(fact[1]);
}

Fact.prototype.existName = function(fact) {
	return this.name == fact[0];
}
Fact.prototype.equals = function(fact) {
	return (this.name==fact[0]) && (contains(this.args,fact[1]));
}


var is_Rule = function (query){
	var valids = [];
	var out= rr.map(function (x){
		valids.push(verify_Rule(x,query));
    })
	return contains(valids,true);
}

var verify_Rule = function (rule,query){
	return rule.is_Valid(query);
}

Rule.prototype.is_Valid = function(query) {
	if (this.name==query[0]); {
    	var ruleParametrizada = this.origin;
    	for (i=0 ; i < query[1].length ; i++){
    	ruleParametrizada = ruleParametrizada.replaceAll(this.args[i],query[1][i])
    	}
    	ruleParametrizada = ruleParametrizada.split(":- ")[1].split("), ").join(")+").split("+")
    	for(i=0 ; i< ruleParametrizada.length; i ++){

			if (!is_Fact(parse_fact(ruleParametrizada[i]))){
				return false}
    	}
    	return true;
    }
	return false;
}
 ff=[];
 rr=[];
 rr_names=[];
 ff_names=[];

this.parseDB = function (db) {
	create_db(db,ff,rr);
}

var acom_query=function(query){
	return [query[0],query[1].split(", ")]
}
}

module.exports = Interpreter;
