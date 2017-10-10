var Interpreter = function () {


function checkFacts(line) {
    return !line.includes(":-") ;
}

function checkRule(line) {
    return line.includes(":-") ;
}


var Rule = function (name,args,factss) {
	this.name= name;
	this.args= args;
	this.factss=factss;
}
var create_db = function (db,ff,rr) {
	db.map(function(x){if (checkFacts(x)) {add_Fact(parse_fact(x));} else {add_Rule(parse_rule(x))}});
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
	return [name,largs,facts];
}

var add_Rule = function (rule){
	rr.push(new Rule(rule[0],rule[1],rule[2]));
	rr_names.push(rule[0]);
}

this.checkQuery  = function (query){
	var pquery=parse_fact(query);
}



var is_Fact = function (query){
	var valids = [];
	var out = ff.map(function (x){
		valids.push(x.equals(query));
    })
	return valids.includes(true);
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
	return (this.name==fact[0]) && (this.args.includes(fact[1]));
}


var is_Rule = function (query){
	var valids = [];
	var out= rr.map(function (x){
		valids.push(verify_Rule(x,query));
    })
	return valids.includes(true);
}

var verify_Rule = function (rule,query){
	return rule.is_Valid(query);
}

Rule.prototype.is_Valid = function(query) {
	if (this.name==query[0]); {
	var correctFacts=[];
	var aux;
	return correctFacts.every(function (x){return is_Fact(parse_fact(x))});
}
	return false;
}
this.ff=[];
this.rr=[];
this.rr_names=[];
this.ff_names=[];

this.parseDB = function () {
	create_db(db,ff,rr);
}
}

module.exports = Interpreter;
