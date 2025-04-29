;(function(){
    // Inject CSS once
    const css = `
      .image-compare-widget { position: relative; overflow: hidden; cursor: ew-resize; }
      .image-compare-widget img { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; user-select:none; }
      .compare-top { clip-path:polygon(0 0,0 0,0 100%,0 100%); z-index:2; }
      .compare-bottom { z-index:1; }
      .compare-slider { position:absolute; top:0; width:5px; height:100%; background:#fff; z-index:3; cursor:ew-resize; }
      .compare-slider:hover { background:red; }
    `;
    if (!document.getElementById('compare-widget-styles')) {
      let s = document.createElement('style');
      s.id = 'compare-widget-styles';
      s.textContent = css;
      document.head.appendChild(s);
    }
  
    document.querySelectorAll('.image-compare-widget').forEach(container => {
      if (container._compareInitialized) return;
      container._compareInitialized = true;
  
      // read images & optional start-percent
      const before = container.dataset.before;
      const after  = container.dataset.after;
      const startPct = parseFloat(container.dataset.start) || 50;
  
      // build DOM
      const imgB = document.createElement('img');
      imgB.src = before; imgB.className = 'compare-bottom';
      const imgT = document.createElement('img');
      imgT.src = after;  imgT.className = 'compare-top';
      const slider = document.createElement('div');
      slider.className = 'compare-slider';
      container.append(imgB, imgT, slider);
  
      let isDragging = false;
      const update = clientX => {
        const r = container.getBoundingClientRect();
        let x = clientX - r.left;
        x = Math.max(0, Math.min(x, r.width));
        slider.style.left = x+'px';
        const p = (x/r.width)*100;
        imgT.style.clipPath = `polygon(${p}% 0,100% 0,100% 100%,${p}% 100%)`;
      };
  
      // wire drag behavior
      container.addEventListener('mousedown', e=>{
        isDragging = true; update(e.clientX);
      });
      document.addEventListener('mouseup', ()=> isDragging=false);
      document.addEventListener('mousemove', e=> isDragging && update(e.clientX));
  
      // --- new: set initial position based on data-start ---
      // compute an initial clientX
      const rect = container.getBoundingClientRect();
      const initX = rect.left + (startPct/100)*rect.width;
      // run update once so slider & clip-path jump into place
      update(initX);
    });
  })();
  