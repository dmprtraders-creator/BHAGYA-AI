// Tabs navigation
document.addEventListener('DOMContentLoaded', ()=>{
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(t=> t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('active'));
    t.classList.add('active');
    const id = t.getAttribute('data-target');
    const panel = document.getElementById(id);
    if(panel) panel.classList.add('active');
  }));

  // Enquiry form handling (demo)
  const enquiry = document.getElementById('enquiryForm');
  if(enquiry) enquiry.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(enquiry);
    const obj = Object.fromEntries(data.entries());
    alert('Enquiry captured:\nName: '+obj.name+'\nPhone: '+obj.phone+'\nService: '+obj.service);
    enquiry.reset();
  });

  // Helper functions
  function toNum(id){const el=document.getElementById(id);return el?Number(el.value||0):0}
  function show(id,val){const el=document.getElementById(id);if(el)el.textContent=val}

    // Loan calculator
  const calcBtn = document.getElementById('calcBtn');
  if(calcBtn){
    calcBtn.addEventListener('click',(ev)=>{
      ev.preventDefault();
      const income = toNum('income');
      const pension = toNum('pension');
      const obligations = toNum('obligations');
      const loan = toNum('loanAmount');
      const annualRate = toNum('rate');
      const years = toNum('tenure');

      // Net available income after obligations (include pension)
      const netAvailable = Math.max(0, (income + pension) - obligations);

      // FOIR: read editable percent input (default 60). User can override anytime.
      const foirInput = document.getElementById('foirInput');
      let foirPercent = foirInput ? Number(foirInput.value || 0) : 60;
      const foir = Math.max(0, Math.min(100, Number(foirPercent))) / 100;

      const netEligibility = foir * netAvailable;

      // EMI formula
      const monthlyRate = annualRate/100/12;
      const n = Math.max(1, years*12);
      let emi = 0;
      if(monthlyRate>0){
        const r = monthlyRate;
        emi = loan * r * Math.pow(1+r,n) / (Math.pow(1+r,n)-1);
      } else {
        emi = loan / n;
      }

      show('eligibility', '₹ ' + netEligibility.toFixed(2));
      show('emiValue', emi>0 ? '₹ ' + emi.toFixed(2) : '-');
      show('foir', (foir*100).toFixed(0)+'%');

      // Amortization schedule
      const showSchedule = document.getElementById('showSchedule');
      const amortEl = document.getElementById('amortization');
      const amortTable = document.querySelector('#amortTable tbody');
      if(showSchedule && showSchedule.checked && loan>0){
        if(amortEl) amortEl.style.display = 'block';
        if(amortTable) amortTable.innerHTML = '';
        let balance = loan;
        for(let i=1;i<=n;i++){
          let interest = balance * monthlyRate;
          let principal = emi - interest;
          if(principal<0) principal = 0;
          balance = Math.max(0, balance - principal);
          if(amortTable){
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i}</td><td>₹ ${emi.toFixed(2)}</td><td>₹ ${interest.toFixed(2)}</td><td>₹ ${principal.toFixed(2)}</td><td>₹ ${balance.toFixed(2)}</td>`;
            amortTable.appendChild(tr);
          }
          if(balance<=0) break;
        }
      } else if(amortEl) {
        amortEl.style.display = 'none';
      }
    });
  }

  // Apply Car FOIR button (sets FOIR to 100 but keeps it editable)
  const setCarFoir = document.getElementById('setCarFoir');
  if(setCarFoir){
    setCarFoir.addEventListener('click',(e)=>{e.preventDefault(); const f=document.getElementById('foirInput'); if(f) f.value = 100;});
  }

  // Motor insurance calculator (detailed: IDV, depreciation, NCB, add-ons, GST, TP rates by category)
  const motorCalcBtn = document.getElementById('motorCalcBtn');
  if(motorCalcBtn){
    motorCalcBtn.addEventListener('click',(e)=>{
      e.preventDefault();
      const value = toNum('vehicleValue');
      const manufactureYear = toNum('manufactureYear');
      const ageFactor = Math.max(0.1, toNum('motorAgeFactor') || 1);
      const baseRate = toNum('motorBaseRate')/100;
      const discount = Math.max(0, Math.min(100, toNum('motorDiscount')))/100;
      const cc = toNum('cubicCapacity');
      const vType = document.getElementById('vehicleType') ? document.getElementById('vehicleType').value : 'privateCar';
      const coverage = document.getElementById('coverageType') ? document.getElementById('coverageType').value : 'comp';
      const idvInput = toNum('idv');
      const ncbPercent = Math.max(0, Math.min(100, toNum('ncb')))/100;
      const addonZero = document.getElementById('addonZeroDep') && document.getElementById('addonZeroDep').checked;
      const addonRoad = document.getElementById('addonRoadside') && document.getElementById('addonRoadside').checked;
      const addonEngine = document.getElementById('addonEngine') && document.getElementById('addonEngine').checked;
      const gvw = document.getElementById('gvwRange') ? document.getElementById('gvwRange').value : 'u7500';
      const taxiType = document.getElementById('taxiType') ? document.getElementById('taxiType').value : 'smallTaxi';
      const busSeats = toNum('busSeats');
      const currentYear = new Date().getFullYear();
      const carAge = manufactureYear > 0 ? Math.max(0, currentYear - manufactureYear) : 0;

      let finalAgeFactor = ageFactor;
      if(ageFactor === 1){
        finalAgeFactor = 1 + Math.min(0.45, carAge * 0.03);
      }

      let idv = idvInput > 0 ? idvInput : value;
      let dep = 0;
      if(carAge <= 1) dep = 0.05;
      else if(carAge <= 3) dep = 0.15;
      else if(carAge <= 5) dep = 0.25;
      else if(carAge <= 7) dep = 0.35;
      else dep = 0.45;
      if(!idvInput) idv = Math.max(1000, Math.round(value * (1 - dep)));

      const tpRates = {
        privateCar: cc <= 1000 ? 2094 : cc <= 1500 ? 3416 : 7897,
        twoWheeler: cc <= 75 ? 538 : cc <= 150 ? 714 : cc <= 350 ? 1366 : 2804,
        goodsVeh: gvw === 'u7500' ? 21500 : gvw === '7500-12000' ? 31000 : gvw === '12000-20000' ? 40000 : 45000,
        taxi: taxiType === 'smallTaxi' ? 11500 : 20000,
        bus: busSeats > 18 ? 60000 : 25000,
        auto: 5000
      };

      const tpPremium = tpRates[vType] || 0;
      const gstOnTp = tpPremium * 0.18;
      const totalTp = tpPremium > 0 ? tpPremium + gstOnTp : 0;

      const ccMult = cc >= 2000 ? 1.5 : cc >= 1501 ? 1.35 : cc >= 1001 ? 1.25 : cc >= 701 ? 1.15 : cc >= 351 ? 1.05 : cc >= 151 ? 1.0 : 0.9;
      let typeMult = 1;
      if(vType === 'twoWheeler') typeMult = 0.6;
      if(vType === 'goodsVeh') typeMult = 1.5;
      let coverageMult = coverage === 'tp' ? 1 : 1;

      let total = 0;
      let breakdownText = `IDV: ₹ ${idv.toFixed(2)}<br/>Depreciation: ${(dep*100).toFixed(0)}%<br/>Vehicle age: ${carAge} year(s)<br/>`;
      if(coverage === 'tp'){
        breakdownText += `TP premium: ₹ ${tpPremium.toFixed(2)}<br/>GST (18%): ₹ ${gstOnTp.toFixed(2)}`;
        total = totalTp;
      } else {
        const basePremium = Math.max(0, idv * baseRate * finalAgeFactor * ccMult * typeMult * coverageMult * (1 - discount));
        const zeroDepCost = addonZero ? Math.max(500, basePremium * 0.12) : 0;
        const roadsideCost = addonRoad ? 500 : 0;
        const engineCost = addonEngine ? Math.max(1000, basePremium * 0.05) : 0;
        const ownDamage = basePremium + zeroDepCost + engineCost;
        const ncbDiscount = ownDamage * ncbPercent;
        const subtotal = basePremium + zeroDepCost + roadsideCost + engineCost - ncbDiscount;
        const gst = subtotal * 0.18;
        total = Math.max(0, subtotal + gst);
        breakdownText += `Base premium: ₹ ${basePremium.toFixed(2)}<br/>Zero-dep: ₹ ${zeroDepCost.toFixed(2)}<br/>Engine: ₹ ${engineCost.toFixed(2)}<br/>Roadside: ₹ ${roadsideCost.toFixed(2)}<br/>NCB discount: -₹ ${ncbDiscount.toFixed(2)}<br/>GST (18%): ₹ ${gst.toFixed(2)}`;
      }

      const breakdown = document.getElementById('motorBreakdown');
      if(breakdown){ breakdown.innerHTML = breakdownText; }
      show('motorResult', total > 0 ? '₹ ' + total.toFixed(2) : '-');
    });
  }

  // SME insurance calculator
  const smeCalcBtn = document.getElementById('smeCalcBtn');
  if(smeCalcBtn){
    smeCalcBtn.addEventListener('click',(e)=>{
      e.preventDefault();
      const sumInsured = toNum('smeSumInsured');
      const policyType = document.getElementById('smePolicyType')?.value || 'fire';
      const baseRate = toNum('smeBaseRate')/100 || (policyType==='fire' ? 0.0025 : policyType==='marine' ? 0.0015 : 0.0035);
      const discount = Math.max(0, Math.min(100, toNum('smeDiscount')))/100;
      const minP = Math.max(0, toNum('smeMinPremium'));
      const freq = document.getElementById('smeFrequency') ? document.getElementById('smeFrequency').value : 'annual';

      const construction = document.getElementById('smeConstruction')?.value || 'nonCombustible';
      const occupancy = document.getElementById('smeOccupancy')?.value || 'low';
      const safety = document.getElementById('smeSafety')?.value || 'advanced';
      const location = document.getElementById('smeLocation')?.value || 'low';
      const claims = document.getElementById('smeClaims')?.value || 'zero';
      const deductible = document.getElementById('smeDeductible')?.value || 'medium';
      const goodsType = document.getElementById('smeGoodsType')?.value || 'normal';
      const transitMode = document.getElementById('smeTransitMode')?.value || 'road';
      const routeRisk = document.getElementById('smeRouteRisk')?.value || 'low';
      const packaging = document.getElementById('smePackaging')?.value || 'standard';
      const publicLiability = document.getElementById('smePublicLiability')?.value || 'low';
      const footfall = document.getElementById('smeFootfall')?.value || 'low';
      const equipment = document.getElementById('smeEquipment')?.value || 'new';
      const biDays = toNum('smeBIDays');

      let riskFactor = 1;
      const constructionMap = { nonCombustible: 0.9, mixed: 1.0, combustible: 1.2 };
      const occupancyMap = { low: 0.9, medium: 1.1, high: 1.3 };
      const safetyMap = { advanced: 0.85, standard: 1.0, basic: 1.15 };
      const locationMap = { low: 0.95, medium: 1.1, high: 1.25 };
      const claimsMap = { zero: 0.9, few: 1.1, many: 1.3 };
      const deductibleMap = { low: 1.1, medium: 1.0, high: 0.9 };
      const goodsMap = { normal: 0.9, fragile: 1.2, hazardous: 1.4 };
      const transitMap = { road: 1.0, rail: 0.95, sea: 0.9, air: 1.2 };
      const routeMap = { low: 0.95, medium: 1.1, high: 1.3 };
      const packagingMap = { premium: 0.9, standard: 1.0, basic: 1.15 };
      const liabilityMap = { low: 0.95, medium: 1.1, high: 1.25 };
      const footfallMap = { low: 0.95, medium: 1.1, high: 1.2 };
      const equipmentMap = { new: 0.95, aged: 1.15 };

      riskFactor *= constructionMap[construction] || 1;
      riskFactor *= occupancyMap[occupancy] || 1;
      riskFactor *= safetyMap[safety] || 1;
      riskFactor *= locationMap[location] || 1;
      riskFactor *= claimsMap[claims] || 1;
      riskFactor *= deductibleMap[deductible] || 1;
      riskFactor *= equipmentMap[equipment] || 1;
      if(policyType==='marine'){
        riskFactor *= goodsMap[goodsType] || 1;
        riskFactor *= transitMap[transitMode] || 1;
        riskFactor *= routeMap[routeRisk] || 1;
        riskFactor *= packagingMap[packaging] || 1;
      }
      if(policyType==='hotel' || policyType==='business'){
        riskFactor *= liabilityMap[publicLiability] || 1;
        riskFactor *= footfallMap[footfall] || 1;
      }
      if(biDays > 0){
        riskFactor *= 1 + Math.min(0.35, biDays / 365 * 0.2);
      }

      const rawPremium = sumInsured * baseRate * riskFactor;
      const premiumAfterDiscount = Math.max(0, rawPremium * (1 - discount));
      let premium = Math.max(minP, premiumAfterDiscount);
      if(freq==='monthly') premium = premium / 12;

      const breakdown = document.getElementById('smeBreakdown');
      if(breakdown){
        breakdown.innerHTML = `Policy: ${policyType.toUpperCase()}<br/>Sum insured: ₹ ${sumInsured.toFixed(2)}<br/>Base rate: ${(baseRate*100).toFixed(3)}%<br/>Risk factor: ${riskFactor.toFixed(2)}<br/>Premium before discount: ₹ ${rawPremium.toFixed(2)}<br/>Discount: ${(discount*100).toFixed(1)}%<br/>Minimum premium: ₹ ${minP.toFixed(2)}<br/>Frequency: ${freq}`;
      }
      show('smeResult', premium>0 ? (freq==='monthly' ? '₹ ' + premium.toFixed(2) + ' / month' : '₹ ' + premium.toFixed(2) + ' / year') : '-');
    });
  }

  // Learn & Apply SME factor
  const learnSmeFactor = document.getElementById('learnSmeFactor');
  if(learnSmeFactor){
    learnSmeFactor.addEventListener('click',(e)=>{
      e.preventDefault();
      const policyType = document.getElementById('smePolicyType')?.value || 'fire';
      const construction = document.getElementById('smeConstruction')?.value || 'nonCombustible';
      const occupancy = document.getElementById('smeOccupancy')?.value || 'low';
      const safety = document.getElementById('smeSafety')?.value || 'advanced';
      const location = document.getElementById('smeLocation')?.value || 'low';
      const claims = document.getElementById('smeClaims')?.value || 'zero';
      const deductible = document.getElementById('smeDeductible')?.value || 'medium';
      const goodsType = document.getElementById('smeGoodsType')?.value || 'normal';
      const transitMode = document.getElementById('smeTransitMode')?.value || 'road';
      const routeRisk = document.getElementById('smeRouteRisk')?.value || 'low';
      const packaging = document.getElementById('smePackaging')?.value || 'standard';
      const publicLiability = document.getElementById('smePublicLiability')?.value || 'low';
      const footfall = document.getElementById('smeFootfall')?.value || 'low';
      const equipment = document.getElementById('smeEquipment')?.value || 'new';
      const biDays = toNum('smeBIDays');

      let factor = 1;
      const constructionMap = { nonCombustible: 0.9, mixed: 1.0, combustible: 1.2 };
      const occupancyMap = { low: 0.9, medium: 1.1, high: 1.3 };
      const safetyMap = { advanced: 0.85, standard: 1.0, basic: 1.15 };
      const locationMap = { low: 0.95, medium: 1.1, high: 1.25 };
      const claimsMap = { zero: 0.9, few: 1.1, many: 1.3 };
      const deductibleMap = { low: 1.1, medium: 1.0, high: 0.9 };
      const goodsMap = { normal: 0.9, fragile: 1.2, hazardous: 1.4 };
      const transitMap = { road: 1.0, rail: 0.95, sea: 0.9, air: 1.2 };
      const routeMap = { low: 0.95, medium: 1.1, high: 1.3 };
      const packagingMap = { premium: 0.9, standard: 1.0, basic: 1.15 };
      const liabilityMap = { low: 0.95, medium: 1.1, high: 1.25 };
      const footfallMap = { low: 0.95, medium: 1.1, high: 1.2 };
      const equipmentMap = { new: 0.95, aged: 1.15 };

      factor *= constructionMap[construction] || 1;
      factor *= occupancyMap[occupancy] || 1;
      factor *= safetyMap[safety] || 1;
      factor *= locationMap[location] || 1;
      factor *= claimsMap[claims] || 1;
      factor *= deductibleMap[deductible] || 1;
      factor *= equipmentMap[equipment] || 1;
      if(policyType==='marine'){
        factor *= goodsMap[goodsType] || 1;
        factor *= transitMap[transitMode] || 1;
        factor *= routeMap[routeRisk] || 1;
        factor *= packagingMap[packaging] || 1;
      }
      if(policyType==='hotel' || policyType==='business'){
        factor *= liabilityMap[publicLiability] || 1;
        factor *= footfallMap[footfall] || 1;
      }
      if(biDays > 0){
        factor *= 1 + Math.min(0.35, biDays / 365 * 0.2);
      }

      const disp = document.getElementById('smeFactorDisplay');
      if(disp){ disp.textContent = factor.toFixed(2); disp.dataset.factor = factor; }
    });
  }
});
