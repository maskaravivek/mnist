import Immutable from 'immutable';

class DrawArea extends React.Component {
    constructor() {
        super();

        this.state = {
            lines: new Immutable.List(),
            isDrawing: false
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown(mouseEvent) {
        if (mouseEvent.button != 0) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => ({
            lines: prevState.lines.push(new Immutable.List([point])),
            isDrawing: true
        }));
    }

    handleMouseMove(mouseEvent) {
        if (!this.state.isDrawing) {
            return;
        }

        const point = this.relativeCoordinatesForEvent(mouseEvent);

        this.setState(prevState => ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
        }));
    }

    handleMouseUp() {
        this.setState({ isDrawing: false });
    }

    relativeCoordinatesForEvent(mouseEvent) {
        const boundingRect = this.refs.drawArea.getBoundingClientRect();
        return new Immutable.Map({
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        });
    }

    render() {
        return (
            <div
                className="drawArea"
                ref="drawArea"
                style={
                    {
                        width: "400px",
                        height: "400px",
                        float: "left",
                        border: "1px solid black",
                        background: "black",
                        cursor: "crosshair"
                    }
                }
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
            >
                <Drawing lines={this.state.lines} />
            </div>
        );
    }
}

function Drawing({ lines }) {
    function svgToImageURL(svgString) {
        console.log('svgString = ' + svgString);
        var canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        var ctx = canvas.getContext("2d");
        var DOMURL = self.URL || self.webkitURL || self;
        var img = new Image();
        var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        var url = DOMURL.createObjectURL(svg);
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            var png = canvas.toDataURL("image/png");
            localStorage.setItem('image', png)
        };
        img.fill = 'white';
        img.src = url;
    }
    return (
        <div style={
            {
                width: "100%",
                height: "100%",
            }
        } id="something">
            <svg onClick={() => {
                let svg = document.getElementById('drawing'); // or whatever you call it
                let serializer = new XMLSerializer();
                let str = serializer.serializeToString(svg);
                svgToImageURL(str)
            }} id={"drawing"} style={
                {
                    width: "100%",
                    height: "100%",
                }
            } >
                {
                    lines.map((line, index) => (
                        <DrawingLine key={index} line={line} />
                    ))
                }
            </svg >
        </div>
    );
}

function DrawingLine({ line }) {
    const pathData = "M " +
        line
            .map(p => {
                return `${p.get('x')} ${p.get('y')}`;
            })
            .join(" L ");

    return <path style={{
        "fill": "black",
        "stroke-width": "10px",
        "stroke": "white",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
    }} d={pathData} />;
}

export default DrawArea;