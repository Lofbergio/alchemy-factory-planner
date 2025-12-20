import dagre from "@dagrejs/dagre";
import { Edge, Node, Position } from "@xyflow/react";
import { ProductionNode } from "../../engine/types";

const nodeWidth = 250;

// Helper to estimate node height for centering
export const estimateHeight = (data: ProductionNode) => {
    let h = 66; // Base padding + header
    if (data.isTarget) h += 24;
    if (data.deviceCount > 0) h += 24;
    if (data.heatConsumption > 0) h += 24;
    return h;
};

export const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "LR",
) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({
        rankdir: direction,
        // ranker: 'network-simplex',
        ranker: 'tight-tree',
        ranksep: 180,
        nodesep: 50,
        acyclicer: 'greedy',
    });

    // Map to store calculated heights to avoid re-calc
    const nodeHeights = new Map<string, number>();

    nodes.forEach((node) => {
        // Safely cast data
        const data = node.data as unknown as ProductionNode;
        const height = estimateHeight(data);
        nodeHeights.set(node.id, height);

        dagreGraph.setNode(node.id, { width: nodeWidth, height: height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // --- Super Root Logic ---
    // Identify sources (nodes with no incoming edges) to pin them to the left
    const targetIds = new Set(edges.map((e) => e.target));
    const sources = nodes.filter((n) => !targetIds.has(n.id));

    // Add a hidden root node connected to all sources
    const SUPER_ROOT = '__SUPER_ROOT__';
    dagreGraph.setNode(SUPER_ROOT, { width: 1, height: 1 });

    sources.forEach(source => {
        // Connect Root -> Source with minlen 1 to enforce rank 0 (effectively)
        dagreGraph.setEdge(SUPER_ROOT, source.id, { minlen: 1, weight: 100 });
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const height = nodeHeights.get(node.id) || 100;

        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - height / 2,
            },
            style: { width: nodeWidth }, // Enforce width
        };
    });

    return { nodes: newNodes, edges };
};
