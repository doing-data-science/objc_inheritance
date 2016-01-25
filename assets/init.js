'use strict';

var radius = 50;
var diameter = 960 * radius;

var tree = d3
  .layout
  .tree()
  .size([360, diameter / 2 - 120])
  .separation(function(a, b) {
    return (a.parent == b.parent ? 1 : 2) / a.depth;
  });

var diagonal = d3
  .svg
  .diagonal
  .radial()
  .projection(function(d) {
    return [d.y, d.x / 180 * Math.PI];
  });

var svg = d3
  .select('body')
  .append('svg')
  .attr('width', diameter)
  .attr('height', diameter)
  .append('g')
  .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');

d3.json('data/inheritance.json', function(error, root) {

  if (error) {
    throw error;
  }

  var nodes = tree.nodes(root);
  var links = tree.links(nodes);

  var link = svg
    .selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', diagonal);

  var node = svg
    .selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
    });

  node
    .append('circle')
    .attr('r', 4.5);

  node
    .append('text')
    .attr('id', function(d) {
      return d.name;
    })
    .attr('dy', '.31em')
    .attr('text-anchor', function(d) {
      return d.x < 180 ? 'start' : 'end';
    })
    .attr('transform', function(d) {
      return d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)';
    })
    .text(function(d) {
      return d.name;
    });

  d3
    .select('body')
    .style('zoom', 2 / radius);

  document.addEventListener('click', function(e) {
    var target = e.target;

    if (target.nodeName.toUpperCase() === 'TEXT') {
      var toggle = document.body.className === 'zoomIn';
      var text = target.innerHTML.trim();

      if (toggle) {
        window.open('https://developer.apple.com/search/?q=' + text + '&platform=iOS');
        return;
      }

      document.body.className = 'zoomIn';

      d3
        .select('body')
        .style('zoom', 1);
      zoom.to({
        element: document.querySelector('#' + text),
        callback: function() {
        },
        padding: 200
      });
    } else {
      d3
        .select('body')
        .style('zoom', 2 / radius);

      zoom.out();
      document.body.className = '';
    }
  });
});
