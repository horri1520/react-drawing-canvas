import { makeStyles, IconButton, Button } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import imgSrc from '../../../SANY0033.jpg'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        background: '#000000',
    },
    buttonsWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'calc( 100% - 24px )',
        height: 80,
        padding: '0px 12px',
    },
    canvasWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'calc( 100% - 80px )'
    },
    colorSelectorsWrapper: {
        width: '100px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    colorSelector: {
        display: 'inline-block',
        width: 24,
        height: 24,
        borderRadius: '50%',
        cursor: 'pointer',
    },
    redSelector: {
        background: '#ff6347',
        '&:hover': {
            background: '#ff6347',
        },
    },
    yellowSelector: {
        background: '#ffdc00',
        '&:hover': {
            background: '#ffdc00',
        },
    },
    greenSelector: {
        background: '#3cb37a',
        '&:hover': {
            background: '#3cb37a',
        },
    },
})

const DrawingCanvas: React.FC = () => {

    const classes = useStyles();
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const previousMatrix = useRef({ x: 0, y: 0 });
    const latestMouseEventType = useRef<string>('');
    const canvasHistories = useRef<string[]>([]);
    const [drawn, setDrawn] = useState<boolean>(false);

    const saveCurrentCanvas = () => {
        const currentCanvasRef = canvasRef.current;
        if (currentCanvasRef != null) {
            const currentCanvas = currentCanvasRef.toDataURL('image/png');
            if (currentCanvas !== 'data:,') {
                canvasHistories.current.push(currentCanvas);
                console.log(canvasHistories.current);
            }
        }
    }

    const onClickUndo = () => {
        const currentCanvasRef = canvasRef.current;
        if (currentCanvasRef != null) {
            const canvasContext = currentCanvasRef.getContext('2d');
            if (canvasContext != null) {
                canvasHistories.current.pop()
                console.log(canvasHistories.current);
                if (canvasHistories.current.length === 1) {
                    setDrawn(false);
                }
                const canvasHistoryData = new Image();
                canvasHistoryData.crossOrigin = '*';
                canvasHistoryData.src = canvasHistories.current[canvasHistories.current.length - 1];
                canvasContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
                canvasHistoryData.onload = _ => {
                    canvasContext.drawImage(canvasHistoryData, 0, 0, canvasSize.width, canvasSize.height);
                }
            }
        }
    };

    const colors = { red: '#ff6347', yellow: '#ffdc00', green: '#3cb37a' };
    const color = useRef<string>(colors.red);
    const onClickColorSelector = (newColor: string) => {
        color.current = newColor;
    }

    const img = new Image();
    img.crossOrigin = '*';
    img.src = imgSrc;

    useEffect(() => {
        const imageWidth = img.width;
        const imageHeight = img.height;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight - 80;
        console.log(innerWidth, innerHeight);
        const landscape = imageWidth > imageHeight;
        if (landscape) {
            if (imageWidth > innerWidth) {
                const canvasWidth = innerWidth;
                const canvasHeight = imageHeight * (canvasWidth / imageWidth)
                setCanvasSize({ width: canvasWidth, height: canvasHeight });
            } else {
                setCanvasSize({width: imageWidth, height: imageHeight});
            }
        } else {
            if (imageHeight > innerHeight) {
                const canvasHeight = innerHeight;
                const canvasWidth = imageWidth * (canvasHeight / imageHeight);
                setCanvasSize({ width: canvasWidth, height: canvasHeight });
            } else {
                setCanvasSize({width: imageWidth, height: imageHeight});
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        console.log(canvasSize);
        const currentCanvasRef = canvasRef.current;
        if (currentCanvasRef != null) {
            const canvasContext = currentCanvasRef.getContext('2d');
            if (canvasContext != null) {
                img.onload = _ => {
                    canvasContext.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
                    canvasHistories.current.push(currentCanvasRef.toDataURL('image/png'));
                };
            }
            currentCanvasRef.addEventListener('mousedown', drawLine);
            currentCanvasRef.addEventListener('mousemove', drawLine);
            currentCanvasRef.addEventListener('mouseout', drawLine);
            currentCanvasRef.addEventListener('mouseup', drawLine);
        }
        return () => {
            if (currentCanvasRef != null) {
                currentCanvasRef.removeEventListener('mousedown', drawLine);
                currentCanvasRef.removeEventListener('mousemove', drawLine);
                currentCanvasRef.removeEventListener('mouseout', drawLine);
                currentCanvasRef.removeEventListener('mouseup', drawLine);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasSize])

    const drawLine = (event: MouseEvent) => {
        const eventType = event.type;
        const eventMatrix = { x: event.offsetX, y: event.offsetY };

        const alreadyClicked = latestMouseEventType.current === 'mousedown';
        const terminateDrawing = eventType === 'mouseout' || eventType === 'mouseup';
        const startDrawing = eventType === 'mousedown';
        const drawing = alreadyClicked && eventType === 'mousemove';
        const endDrawing = alreadyClicked && terminateDrawing;
        if (startDrawing) {
            if (!drawn) {
                setDrawn(true);
            }
            latestMouseEventType.current = eventType;
            previousMatrix.current = eventMatrix;
        } else if (drawing) {
            const currentCanvasRef = canvasRef.current;
            if (currentCanvasRef != null) {
                const canvasContext = currentCanvasRef.getContext('2d');
                if (canvasContext != null) {
                    canvasContext.lineCap = 'round';
                    canvasContext.lineWidth = 7;
                    canvasContext.strokeStyle = color.current;
                    canvasContext.beginPath();
                    canvasContext.moveTo(
                      previousMatrix.current.x,
                      previousMatrix.current.y
                    );
                    canvasContext.lineTo(eventMatrix.x, eventMatrix.y);
                    canvasContext.stroke();
                    previousMatrix.current = eventMatrix;
                }
            }
        } else if (endDrawing) {
            const currentCanvasRef = canvasRef.current;
            if (currentCanvasRef != null) {
                latestMouseEventType.current = eventType;
                saveCurrentCanvas();
            }
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.buttonsWrapper}>
                <div className={classes.colorSelectorsWrapper}>
                    <IconButton
                        className={`${classes.colorSelector} ${classes.redSelector}`}
                        onClick={() => onClickColorSelector(colors.red)}
                    />
                    <IconButton
                        className={`${classes.colorSelector} ${classes.yellowSelector}`}
                        onClick={() => onClickColorSelector(colors.yellow)}
                    />
                    <IconButton
                        className={`${classes.colorSelector} ${classes.greenSelector}`}
                        onClick={() => onClickColorSelector(colors.green)}
                    />
                </div>
                <Button
                    style={{ color: 'white' }}
                    onClick={() => onClickUndo()}
                    variant='contained'
                    disabled={!drawn}
                >
                    Undo
                </Button>
            </div>
            <div className={classes.canvasWrapper}>
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                />
            </div>
        </div>
    );
};

export default DrawingCanvas;