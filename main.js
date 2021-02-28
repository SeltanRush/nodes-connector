const connectionsWrapperNode = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
const connectionsWrapperNodeNS = connectionsWrapperNode.namespaceURI;

document.body.appendChild(connectionsWrapperNode);
connectionsWrapperNode.style.width = "100%";
connectionsWrapperNode.style.height = "100%";
connectionsWrapperNode.style.position = "absolute";
connectionsWrapperNode.style.pointerEvents = "none";
connectionsWrapperNode.style.top = 0;
connectionsWrapperNode.style.left = 0;

const createConnectionNode = () => {
  const connectionNode = document.createElementNS(
    connectionsWrapperNodeNS,
    "line"
  );
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

const connectNodes = (firstNodeSelector, secondNodeSelector) => {
  const firstNode = document.querySelector(firstNodeSelector);
  const secondNode = document.querySelector(secondNodeSelector);

  const connectionNode = createConnectionNode();

  if (!firstNode || !secondNode) {
    throw new Error("Cannot find elements!");
  }

  const renderConnection = () => {
    const { x1, x2, y1, y2 } = computeNewConnectionStyles(
      firstNode,
      secondNode
    );
    console.log(x1, x2, y1, y2);
    const step = Math.sqrt(x1 * x2 + y1 * y2) / 100;

    connectionNode.setAttribute("x1", x1);
    connectionNode.setAttribute("x2", x2);
    connectionNode.setAttribute("y1", y1);
    connectionNode.setAttribute("y2", y2);
  };

  const removeConnection = () => {
    connectionNode.remove();
  };

  const isNodesExistsInBody = () => {
    return (
      document.body.contains(firstNode) && document.body.contains(secondNode)
    );
  };

  const observer = new MutationObserver((mutations, observer) => {
    const isMutationOnConnections = mutations.some((m) =>
      connectionsWrapperNode.contains(m.target)
    );
    if (!isMutationOnConnections) {
      if (firstNode && secondNode && isNodesExistsInBody()) {
        renderConnection();
      } else {
        observer.disconnect();
        removeConnection();
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });

  firstNode.addEventListener("transitionrun", renderConnection);
  renderConnection();
};
