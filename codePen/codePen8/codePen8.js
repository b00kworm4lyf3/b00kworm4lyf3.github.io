// Helper function to round numbers
function rnd(n, p = 2) { return +n.toFixed(p) }

// Function to create the gradient blobs
document.addEventListener('DOMContentLoaded', function() {
    const d = 400;
    const grad = [
        ['#ff6cab', '#7366ff'], 
        ['#2e8de1', '#b65eba'], 
        ['#8a64eb', '#64e8de'], 
        ['#e65eab', '#7bf2e9'], 
        ['#7d77ff', '#ff9482'], 
        ['#ff661b', '#ffcf1b'], 
        ['#ea4d2c', '#ffa62e'], 
        ['#00ff54', '#00b8ba'], 
        ['#6454f0', '#6ee2f5'], 
        ['#3499ff', '#3a3985'], 
        ['#f630a0', '#ff9897'], 
        ['#ee4d5f', '#ffcda5'], 
        ['#8441a4', '#ff5b94'], 
        ['#f869d5', '#5650de'], 
        ['#00bd56', '#f9fd50'], 
        ['#c7004c', '#ffaaaa'], 
        ['#fff6a2', '#fc8a15']
    ];
    const n = grad.length, r = 0.5 * d;
    const samplesSection = document.querySelector('.samples');
    
    grad.forEach((colors, i) => {
        // Create blob container
        const blobDiv = document.createElement('div');
        blobDiv.className = 'blob';
        blobDiv.style.setProperty('--c', colors[1]); // Set the second color as --c
        
        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `${-r} ${-r} ${d} ${d}`);
        
        // Create radial gradient
        const radialGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        radialGradient.setAttribute('id', `g${i}`);
        radialGradient.setAttribute('gradientUnits', 'objectBoundingBox');
        radialGradient.setAttribute('fx', '.25');
        radialGradient.setAttribute('fy', '.75');
        
        // Create stops
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('stop-color', colors[1]); // First color
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('stop-color', colors[0]); // Second color
        stop2.setAttribute('offset', '.2');
        
        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '1');
        // The CSS will handle the transparency
        
        // Create circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '55%');  // Set radius
        circle.setAttribute('fill', `url(#g${i})`);
        // Add data-filter attribute to match a modified CSS selector
        circle.setAttribute('data-filter', 'active'); 
        
        // Append elements
        radialGradient.appendChild(stop1);
        radialGradient.appendChild(stop2);
        radialGradient.appendChild(stop3);
        
        svg.appendChild(radialGradient);
        svg.appendChild(circle);
        
        blobDiv.appendChild(svg);
        samplesSection.appendChild(blobDiv);
    });
});

// Mousemove event handler for interactive gradient focal point
addEventListener('mousemove', e => {
    let _t = e.target;
    
    if(_t.classList.contains('blob')) {
        let r = _t.getBoundingClientRect(), 
            _g = _t.querySelector('radialGradient'), 
            dx = (e.clientX - r.x)/r.width - .5, 
            dy = (e.clientY - r.y)/r.height - .5, 
            m = Math.min(.49, Math.hypot(dy, dx)), 
            a = Math.atan2(dy, dx);
        
        _g.setAttribute('fx', rnd(.5 + m*Math.cos(a)));
        _g.setAttribute('fy', rnd(.5 + m*Math.sin(a)));
    }
});