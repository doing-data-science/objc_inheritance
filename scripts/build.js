#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var data = fs.readFileSync(path.join(__dirname, '..', 'data', 'inheritance.data'), 'utf8');

data = data.trim().split('\n');

var arr = [];

data.forEach(function(item) {
  var temp = item.split(',');
  var name = temp[0];
  var parent = temp[1];

  if (parent === 'null') {
    parent = null;
  }
  arr.push({
    id: name,
    name: name,
    parent: parent
  });
});

var createTree = function(array, rootNodes) {
  var tree = [];

  for (var rootNode in rootNodes) {
    var node = rootNodes[rootNode];
    var childNode = array[node['id']];

    if (childNode) {
      node.children = createTree(array, childNode);
    }
    tree.push(node);
  }

  return tree;
};

var groupByParents = function(array) {
  var parents = {};

  array.forEach(function(item) {
    var parentID = item['parent'] || '0';

    if (parentID && Object.hasOwnProperty.call(parents, parentID)) {
      parents[parentID].push(item);
      return ;
    }

    parents[parentID] = [item];
  });

  return parents;
};

var data = arr.slice();
var grouped = groupByParents(data);
var tree = createTree(grouped, grouped['0']);

// NSObject
tree = tree[7];

fs.writeFileSync(path.join(__dirname, '..', 'data', 'inheritance.json'), JSON.stringify(tree));

console.log('build success!');
