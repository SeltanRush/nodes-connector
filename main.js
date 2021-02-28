const OBSERVER_INTERVAL = 50;

const connectNodes = (() => {
  const connectionsWrapperNode = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  connectionsWrapperNode.style.width = "100%";
  connectionsWrapperNode.style.height = "100%";
  connectionsWrapperNode.style.position = "fixed";
  connectionsWrapperNode.style.pointerEvents = "none";
  connectionsWrapperNode.style.top = 0;
  connectionsWrapperNode.style.left = 0;

  document.body.appendChild(connectionsWrapperNode);

  const createConnectionNode = (NS) => {
    const connectionNode = document.createElementNS(NS, "line");
    connectionsWrapperNode.appendChild(connectionNode);
    connectionNode.setAttribute("stroke", "black");

    return connectionNode;
  };

  const computeNewConnectionStyles = (firstNode, secondNode) => {
    const firstNodeCoords = firstNode.getBoundingClientRect();
    const secondNodeCoords = secondNode.getBoundingClientRect();

    return {
      y1: firstNodeCoords.top,
      y2: secondNodeCoords.top,
      x1: firstNodeCoords.left,
      x2: secondNodeCoords.left,
    };
  };

  return (firstNodeSelector, secondNodeSelector) => {
    const firstNode = document.querySelector(firstNodeSelector);
    const secondNode = document.querySelector(secondNodeSelector);

    const connectionNode = createConnectionNode(
      connectionsWrapperNode.namespaceURI
    );

    if (!firstNode || !secondNode) {
      throw new Error("Cannot find elements!");
    }

    if (
      connectionsWrapperNode.isSameNode(firstNode) ||
      connectionsWrapperNode.isSameNode(secondNode)
    ) {
      throw new Error("Cannot build connection for these elements");
    }

    if (
      connectionsWrapperNode.contains(firstNode) ||
      connectionsWrapperNode.contains(secondNode)
    ) {
      throw new Error("Cannot build connection for these elements");
    }

    const renderConnection = () => {
      const { x1, x2, y1, y2 } = computeNewConnectionStyles(
        firstNode,
        secondNode
      );

      const isPositionChanged =
        connectionNode.attributes.x1 !== x1 ||
        connectionNode.attributes.x2 !== x2 ||
        connectionNode.attributes.y1 !== y1 ||
        connectionNode.attributes.y2 !== y2;

      if (isPositionChanged) {
        connectionNode.setAttribute("x1", x1);
        connectionNode.setAttribute("x2", x2);
        connectionNode.setAttribute("y1", y1);
        connectionNode.setAttribute("y2", y2);
      }
    };

    const removeConnection = () => {
      connectionNode.remove();
    };

    const observer = setInterval(() => {
      if (
        document.body.contains(firstNode) &&
        document.body.contains(secondNode)
      ) {
        renderConnection();
      } else {
        removeConnection();
        clearInterval(observer);
      }
    }, [OBSERVER_INTERVAL]);

    renderConnection();
  };
})();
