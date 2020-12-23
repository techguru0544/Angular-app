import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
name: 'trimstr'
})
export class TrimstrPipe implements PipeTransform {

    /** Used for the trim the string data nd add (...) */
    transform(value: string, args: string): string {
        let newargs = 0;
        if (args === <any>190) {
            newargs = <any>args;
            args = <any>180;

        }
        const limit = args ? parseInt(args, 10) : 10;
        let trail = '...';
        if (newargs > 0) {
            trail = '';
        }
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }

}
