import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import * as d3 from "d3";

const EventVisualization = ({url, inputValue, token}) => {
    const [events, setEvents] = useState({});
    const [eventActions, setEventActions] = useState({});

    const fetchProtectedContent = useCallback(async () => {
        try {
          const response = await axios.post(
            `${url}/event-root`,
            {
              patient_id: inputValue,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.data.leaf !== 'i'){
            // console.log(response.data.root)
            setEvents(response.data.leaf);
          }
          if (response.data.root !== 'h'){
            setEventActions(response.data.root);
            console.log(response.data.root)
          }
        } catch (error) {
          console.error(error);
        }
    }, [url, inputValue, token]);

    useEffect(() => {
        fetchProtectedContent();
    }, [fetchProtectedContent]);

    useEffect(() => {
        if (Object.keys(events).length !== 0) {
          createGraph(events);
        }
    }, [events, eventActions]);

    const createGraph = (events) => {
        const width = 1200;
        const height = 600;
    
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);
    
        const nodesMap = {};
        const links = [];
    
        let prevEventID = null;
        // Create links between events and dependent nodes
        Object.keys(events).forEach(eventID => {
            const dependentNodes = events[eventID];
            // Create event node
            if (!nodesMap[eventID]) {
                const eventNode = { id: eventID, name: eventActions[eventID] };
                nodesMap[eventID] = eventNode;
            }
    
            // Create dependent nodes and links
            dependentNodes.forEach(node => {
                const nodeID = Object.keys(node)[0];
                const nodeName = Object.values(node)[0];
                if (!nodesMap[nodeID]) {
                    const newNode = { id: nodeID, name: nodeName };
                    nodesMap[nodeID] = newNode;
                }
                // Create links between event node and dependent nodes
                links.push({ source: eventID, target: nodeID });
            });
    
            // Create links between consecutive events
            if (prevEventID) {
                links.push({ source: prevEventID, target: eventID });
            }
    
            prevEventID = eventID;
        });
    
        // Create D3 force simulation with bounding box constraints
        const simulation = d3.forceSimulation(Object.values(nodesMap))
            .force('link', d3.forceLink(links).id(d => d.id).distance(50))
            .force('charge', d3.forceManyBody().strength(-100))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX().strength(0.1).x(d => Math.max(0, Math.min(width, d.x)))) // Add forceX with bounding box constraints
            .force('y', d3.forceY().strength(0.1).y(d => Math.max(0, Math.min(height, d.y)))) // Add forceY with bounding box constraints
            .on('tick', () => {
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
            .data(Object.values(nodesMap))
            .enter()
            .append('circle')
            .attr('r', 15)
            .style('fill', d => {
                if (d.id.startsWith('S')) {
                    return 'green';
                } else if (d.id.startsWith('C')) {
                    return 'blue';
                } else if (d.id.startsWith('D')) {
                    return 'red';
                } else if (d.id.startsWith('R')) {
                    return 'yellow';
                } else if (d.id.startsWith('E')) {
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
            .data(Object.values(nodesMap))
            .enter()
            .append('text')
            .text(d => d.name)
            .style('fill', 'black');
    
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
    
    
    const svgRef = useRef();

    return Object.keys(events).length !== 0 ? <svg ref={svgRef}></svg> : null;
};

export default EventVisualization;
