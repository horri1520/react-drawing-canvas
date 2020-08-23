import { makeStyles, IconButton } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

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

const imgSrc = 'https://synqdevstorage.blob.core.windows.net/group-54/screenshot-54-2020-06-22_06-33-46-1592818426555?sv=2019-02-02&st=2020-08-23T14:04:19Z&se=2020-08-23T15:04:18Z&sr=c&sp=racw&spr=https&sig=N4UHhjBaFVhvumPpid9otOFbZe4%2BEF%2BnNBxukGKYyxE='

const DrawingCanvas: React.FC = () => {

    const classes = useStyles();
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        if (canvasRef.current != null) {
            const canvasContext = canvasRef.current.getContext('2d');
            if (canvasContext != null) {
                canvasContext.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasSize])

    return (
        <div className={classes.root}>
            <div className={classes.buttonsWrapper}>
                <div className={classes.colorSelectorsWrapper}>
                    <IconButton className={`${classes.colorSelector} ${classes.redSelector}`} />
                    <IconButton className={`${classes.colorSelector} ${classes.yellowSelector}`} />
                    <IconButton className={`${classes.colorSelector} ${classes.greenSelector}`} />
                </div>
            </div>
            <div className={classes.canvasWrapper}>
                <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
            </div>
        </div>
    );
};

export default DrawingCanvas;