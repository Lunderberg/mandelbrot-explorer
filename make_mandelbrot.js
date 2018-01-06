function main() {
    generate_image(-2, 2, -2, 2);
}

function generate_image(xmin, xmax, ymin, ymax, max_iter) {
    max_iter = (typeof max_iter !== 'undefined') ? max_iter : 50;

    var canvas = document.getElementById('mandelbrot-canvas');
    var context = canvas.getContext('2d');
    var img_data = context.createImageData(canvas.width, canvas.height);

    var t_start = window.performance.now();

    for(var i=0; i<img_data.width; i++) {
        for(var j=0; j<img_data.height; j++) {
            var x = (i*xmin + (img_data.width-i)*xmax)/img_data.width;
            var y = (j*ymin + (img_data.height-j)*ymax)/img_data.height;

            var iter = mandelbrot_iterations(x, y, max_iter);
            if(iter === max_iter) {
                var color = {r: 0,
                             g: 0,
                             b: 0,
                             a: 255};
            } else {
                var color = {r: 255,
                             g: 255,
                             b: 255,
                             a: 255};
            }
            var index = 4*(j*img_data.width + i);
            img_data.data[index+0] = color.r;
            img_data.data[index+1] = color.g;
            img_data.data[index+2] = color.b;
            img_data.data[index+3] = color.a;
        }
    }

    context.putImageData(img_data, 0, 0);
    var t_end = window.performance.now();
    var runtime_span = document.getElementById('status-runtime');
    runtime_span.innerHTML = ((t_end - t_start)/1000).toFixed(1);
}

function mandelbrot_iterations(x, y, max_iter) {
    var cur_x = x;
    var cur_y = y;
    var iter = 0;

    // Anything that goes outside of radius 2 is guaranteed to diverge.
    while(cur_x*cur_x + cur_y*cur_y < 4 &&
          iter < max_iter) {
        var sq_x = cur_x*cur_x - cur_y*cur_y;
        var sq_y = 2*cur_x*cur_y;

        cur_x = sq_x + x;
        cur_y = sq_y + y;

        iter++;
    }

    if(iter < max_iter) {
        var rad = Math.sqrt(cur_x*cur_x + cur_y*cur_y);
        iter += 1 - Math.log(Math.log(rad))/Math.log(2);
    }

    return iter;
}

main();
