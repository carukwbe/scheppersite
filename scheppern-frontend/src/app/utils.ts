import * as bezierEasing from 'bezier-easing';
import { Renderer2, ElementRef } from '@angular/core';
import { Global } from 'src/environments/environment';

export const capToRange = (value: number, min: number, max: number): number => {
    return Math.min(max, Math.max(min, value));
}

export const mapStartRangeToEndRange = (value: number, startRange: number[], endRange: number[]): number => {
    if (startRange.length != 2 || endRange.length != 2) { console.error("Range Arrays don't match dimensions of 2"); return value; }

    const startRangeSize = startRange[1] - startRange[0];
    const endRangeSize = endRange[1] - endRange[0];
    
    // Find the normalized value within the start range
    const normalizedValueInStartRange = (value - startRange[0]) / startRangeSize; 
    
    // Map the normalized value to the end range
    return normalizedValueInStartRange * endRangeSize + endRange[0]; 
}


export const mapToBezier = (value: number, bezier: number[]): number => {
    if (bezier.length != 4) { console.error("Bezier Array don't match dimensions of 4"); return value; }

    const bezierFunction = bezierEasing(
        bezier[0], bezier[1],
        bezier[2], bezier[3]
    );
    return bezierFunction(value);
}