/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import { CSSProperties, useEffect, useRef } from "react";
import Code, { QRCodeProps } from "react-qr-code";

interface IProps extends QRCodeProps {
    style?: CSSProperties
}

const QRCode = (props: IProps) => {
    const { value, style } = props
    const qrcodeRef = useRef<any>(null)
    const shareAreaRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
        if (qrcodeRef.current) {
            const svg = qrcodeRef.current;
            const svgData = new XMLSerializer().serializeToString(svg);
            shareAreaRef.current!.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
        }
    }, [qrcodeRef.current])
    return <>
        <Code   
            {...props}
            ref={qrcodeRef}
            style={{ display: 'none' }}
            value={encodeURI(value)}
        />
        <img ref={shareAreaRef} style={style} alt="share-course" className={props.className}/>
    </>
}

export default QRCode