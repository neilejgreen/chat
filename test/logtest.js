//Tests for the message logger that deals with redis
// jshint node:true
// global describe
// global it


var assert = require('assert');
var redis = require('redis');

var _quitWasCalled = false;
var _ltrimWasCalled = false;
var _lastEnd, _lastStart, _lastMessage, _lastList, _lastCallback;

redis.createClient = function(){    
    return {
        quitWasCalled:function(){return _quitWasCalled;},
        quit:function(){_quitWasCalled = true;},
        ltrim:function(){_ltrimWasCalled = true;},
        lpush:function(list, message, callback){
            _lastList = list;
            _lastMessage = message;
            callback();
        },
        lrange:function(list, start, end, callback){
            _lastList = list;
            _lastStart = start;
            _lastEnd = end;
            _lastCallback= callback;
        }
    };
};

var chatLog = require('../chatlog');

describe("chatLog", function(){
    describe("close", function(){
        it("should quit redis", function(){
            var log = chatLog.createLog();
            _quitWasCalled = false;
            log.close();
            assert.equal(_quitWasCalled, true);
        });
    });
    
    describe("logMessage", function(){
        it("should add a 'messages' message to redis", function(){
            var log = chatLog.createLog();
            _lastList = _lastMessage = undefined;
            log.logMessage("messages");
            assert.equal(_lastList, "messages");
        });
        
        it("should add a json message to redis", function(){
            var log = chatLog.createLog();
            _lastList = _lastMessage = undefined;
            log.logMessage({ThisObjectShouldBe:"stringified"});
            var jsonObject = JSON.parse(_lastMessage);

            assert.equal(jsonObject.ThisObjectShouldBe, "stringified");
        });
        
        it("should add a timestamp to the message", function(){
            var log = chatLog.createLog();
            _lastList = _lastMessage = undefined;
            log.logMessage({ThisObjectShouldBe:"stringified"});
            var jsonObject = JSON.parse(_lastMessage);
            var timestampDate = new Date(jsonObject.timestamp);
            assert.equal(timestampDate.getFullYear(), new Date().getFullYear());
        });
        
        it("should trim the messages once added", function(){
            var log = chatLog.createLog();
            _ltrimWasCalled = false;
            log.logMessage({ThisObjectShouldBe:"stringified"});
            assert.equal(_ltrimWasCalled, true);
        });
    });
    
    describe("getHistory", function(){
        it("should get all messages in redis", function(){
            var log = chatLog.createLog();
            _lastList = null;
            log.getHistory();
            assert.equal(_lastList, "messages");
            assert.equal(_lastStart, 0);
            assert.equal(_lastEnd, -1);
        });
        
        it("should parse and sort the messages", function(){
            var log = chatLog.createLog();
            _lastList = null;
            var results;
            
            log.getHistory(function(messages){results = messages;});
            
            _lastCallback(null, ['{ "timestamp" : 456 }', '{ "timestamp" : 123 }']);
            assert.equal(results[0].timestamp, 123);
            assert.equal(results[1].timestamp, 456);
        });
    });
    
    
});
