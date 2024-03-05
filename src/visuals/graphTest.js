import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import * as d3 from "d3";

const GraphVisualization = ({url, inputValue, token}) => {
  const [root, setRoot] = useState('');
  const [leaf, setLeaf] = useState('');
  const fetchProtectedContent = useCallback(async () => {
    try {
      const response = await axios.post(
        `${url}/graph-root`,
        {
          patient_id: inputValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRoot(response.data);

      const result = await axios.post(
        `${url}/graph-leaf`,
        {
          patient_id: inputValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaf(result.data);
    } catch (error) {
      console.error(error);
    }
  }, [url, inputValue, token]);

  useEffect(() => {
    fetchProtectedContent();
  }, [fetchProtectedContent]);

  useEffect(() => {
    if (root !== '' && leaf !== '') {
      createGraph(root, leaf);
    }
  }, [root, leaf]);

  const svgRef = useRef();

  const createGraph = (root, leaf) => {
    const width = 1600;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const nodesMap = {};
    const links = [];

    // Add the original node
    const rootnodes = [{ id: inputValue, name: inputValue }];
    nodesMap[inputValue] = rootnodes[0];

    // Create nodes from root and leaf data
    root.forEach(nodeName => {
      if (!nodesMap[nodeName]) {
        const node = { id: nodeName, name: nodeName };
        rootnodes.push(node);
        nodesMap[nodeName] = node;
      }
    });

    // Connect all root nodes to the original node
    rootnodes.slice(1).forEach(node => {
      links.push({ source: inputValue, target: node.id });
    });

    // Create links between root and leaf nodes
    Object.entries(leaf).forEach(([parentNode, children]) => {
      children.forEach(childNode => {
        // Avoid duplicates
        if (!nodesMap[childNode]) {
          const node = { id: childNode, name: childNode };
          rootnodes.push(node);
          nodesMap[childNode] = node;
        }
        // Create links
        links.push({ source: parentNode, target: childNode });
      });
    });

    // Create D3 force simulation with increased link distance for more space between nodes
    const simulation = d3.forceSimulation(rootnodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150)) // Adjust the distance value as needed
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => {
        // Update node and link positions on each tick
        svg.selectAll('line')
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        svg.selectAll('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);

        svg.selectAll('text')
          .attr('x', d => d.x + 10)
          .attr('y', d => d.y + 5);
      });

    // Render links
    svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', 'black');

    // Render nodes
    svg.selectAll('circle')
      .data(rootnodes)
      .enter()
      .append('circle')
      .attr('r', 15)
      .style('fill', d => {
        if (d.name.startsWith('S')) {
          return 'green';
        } else if (d.name.startsWith('C')) {
          return 'blue';
        } else if (d.name.startsWith('D')) {
          return 'red';
        } else if (d.name.startsWith('R')) {
            return 'yellow';
        } else if (d.name.startsWith('E')) {
            return 'black';
        } else {
          return 'lightblue';
        }
      })
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Append labels for nodes
    svg.selectAll('text')
      .data(rootnodes)
      .enter()
      .append('text')
      .text(d => d.name)
      .style('fill', 'Black');

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return <svg ref={svgRef}></svg>;
};

export default GraphVisualization;
