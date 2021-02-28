window.connectNodes = (() => {
  const OBSERVER_INTERVAL = 50;

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
  connectionsWrapperNode.style.zIndex = 1000000;

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
        +connectionNode.getAttribute("x1") !== x1 ||
        +connectionNode.getAttribute("x2") !== x2 ||
        +connectionNode.getAttribute("y1") !== y1 ||
        +connectionNode.getAttribute("y2") !== y2;

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

    const shouldRemoveConnection = () => {
      if (
        !document.body.contains(firstNode) ||
        !document.body.contains(secondNode)
      ) {
        return true;
      }

      if (!isElementVisible(firstNode) || !isElementVisible(secondNode)) {
        return true;
      }

      return false;
    };

    const isElementVisible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === "none") return false;
      if (style.visibility !== "visible") return false;
      if (rect.width === 0 && rect.height === 0) {
        return false;
      }
    };

    const observer = setInterval(() => {
      if (shouldRemoveConnection()) {
        renderConnection();
      } else {
        removeConnection();
        clearInterval(observer);
      }
    }, [OBSERVER_INTERVAL]);

    renderConnection();
  };
})();
