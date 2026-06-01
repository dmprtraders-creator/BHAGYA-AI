 // Calculator view tabs
document.addEventListener('DOMContentLoaded', () => {
  // --- UTILITY HELPERS ---
  // Safe helper to grab values (fallback to 0 if element doesn't exist)
  const getNumValue = (id) => {
    const el = document.getElementById(id);
    return el ? Number(el.value) || 0 : 0;
  };

  const updateText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const toggleDisplay = (id, condition, displayType = 'block') => {
    const el = document.getElementById(id);
    if (el) el.style.display = condition ? displayType : 'none';
  };

  // --- TAB CONTROLLER ---
  const calcTabs = document.querySelectorAll('.calc-tab');
  calcTabs.forEach(tab => tab.addEventListener('click', () => {
    calcTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const selected = tab.dataset.calc;
    toggleDisplay('loanCalc', selected === 'loan', 'flex');
    toggleDisplay('motorCalc', selected === 'motor', 'flex');
    toggleDisplay('smeCalc', selected === 'sme', 'flex');
  }));

  // --- LOAN CALCULATOR ---
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const income = getNumValue('income');
      const pension = getNumValue('pension');
      const obligations = getNumValue('obligations');
      const loan = getNumValue('loanAmount');
      const annualRate = getNumValue('rate');
      const years = getNumValue('tenure');

      const netAvailable = Math.max(0, (income + pension) - obligations);
      const foirPercent = getNumValue('foirInput') || 60;
      const foir = Math.max(0, Math.min(100, foirPercent)) / 100;
      const netEligibility = foir * netAvailable;

      const monthlyRate = annualRate / 100 / 12;
      const totalMonths = Math.max(1, years * 12);
      
      const emi = monthlyRate > 0 
        ? (loan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
        : loan / totalMonths;

      updateText('eligibility', `₹ ${netEligibility.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
      updateText('emiValue', emi > 0 ? `₹ ${emi.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-');
      updateText('foir', `${(foir * 100).toFixed(0)}%`);

      // Amortization Schedule
      const showSchedule = document.getElementById('showSchedule');
      const shouldShowSchedule = showSchedule && showSchedule.checked && loan > 0;
      toggleDisplay('amortization', shouldShowSchedule);

      const amortTable = document.querySelector('#amortTable tbody');
      if (shouldShowSchedule && amortTable) {
        let balance = loan;
        let tableHTML = ''; // Batch updates for massive performance boost
        
        for (let i = 1; i <= totalMonths; i++) {
          let interest = balance * monthlyRate;
          let principal = Math.max(0, emi - interest);
          balance = Math.max(0, balance - principal);

          tableHTML += `<tr>
            <td>${i}</td>
            <td>₹ ${emi.toFixed(2)}</td>
            <td>₹ ${interest.toFixed(2)}</td>
            <td>₹ ${principal.toFixed(2)}</td>
            <td>₹ ${balance.toFixed(2)}</td>
          </tr>`;
          if (balance <= 0) break;
        }
        amortTable.innerHTML = tableHTML;
      }
    });
  }

  // Quick Car FOIR shortcut
  const setCarFoir = document.getElementById('setCarFoir');
  if (setCarFoir) {
    setCarFoir.addEventListener('click', (e) => {
      e.preventDefault();
      const f = document.getElementById('foirInput');
      if (f) f.value = 100;
    });
  }

  // --- MOTOR INSURANCE CALCULATOR ---
  const motorCalcBtn = document.getElementById('motorCalcBtn');
  if (motorCalcBtn) {
    motorCalcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const value = getNumValue('vehicleValue');
      const manufactureYear = getNumValue('manufactureYear');
      const ageFactor = Math.max(0.1, getNumValue('motorAgeFactor') || 1);
      const baseRate = getNumValue('motorBaseRate') / 100;
      const discount = Math.max(0, Math.min(100, getNumValue('motorDiscount'))) / 100;
      const cc = getNumValue('cubicCapacity');
      
      const vType = document.getElementById('vehicleType')?.value || 'privateCar';
      const coverage = document.getElementById('coverageType')?.value || 'comp';
      const idvInput = getNumValue('idv');
      const ncbPercent = Math.max(0, Math.min(100, getNumValue('ncb'))) / 100;

      const addonZero = document.getElementById('addonZeroDep')?.checked;
      const addonRoad = document.getElementById('addonRoadside')?.checked;
      const addonEngine = document.getElementById('addonEngine')?.checked;
      const gvw = document.getElementById('gvwRange')?.value || 'u7500';
      const taxiType = document.getElementById('taxiType')?.value || 'smallTaxi';
      const busSeats = getNumValue('busSeats');

      const carAge = manufactureYear > 0 ? Math.max(0, new Date().getFullYear() - manufactureYear) : 0;
      const finalAgeFactor = ageFactor === 1 ? 1 + Math.min(0.45, carAge * 0.03) : ageFactor;

      // Depreciation scale logic
      let dep = 0.45;
      if (carAge <= 1) dep = 0.05;
      else if (carAge <= 3) dep = 0.15;
      else if (carAge <= 5) dep = 0.25;
      else if (carAge <= 7) dep = 0.35;

      const idv = idvInput > 0 ? idvInput : Math.max(1000, Math.round(value * (1 - dep)));

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
      
      let total = 0;
      let breakdownText = `IDV: ₹ ${idv.toFixed(2)}<br/>Depreciation: ${(dep * 100).toFixed(0)}%<br/>Vehicle age: ${carAge} year(s)<br/>`;

      if (coverage === 'tp') {
        breakdownText += `TP premium: ₹ ${tpPremium.toFixed(2)}<br/>GST (18%): ₹ ${gstOnTp.toFixed(2)}`;
        total = tpPremium > 0 ? tpPremium + gstOnTp : 0;
      } else {
        const ccMult = cc >= 2000 ? 1.5 : cc >= 1501 ? 1.35 : cc >= 1001 ? 1.25 : cc >= 701 ? 1.15 : cc >= 351 ? 1.05 : cc >= 151 ? 1.0 : 0.9;
        const typeMult = vType === 'twoWheeler' ? 0.6 : (vType === 'goodsVeh' ? 1.5 : 1);

        const basePremium = Math.max(0, idv * baseRate * finalAgeFactor * ccMult * typeMult * (1 - discount));
        const zeroDepCost = addonZero ? Math.max(500, basePremium * 0.12) : 0;
        const roadsideCost = addonRoad ? 500 : 0;
        const engineCost = addonEngine ? Math.max(1000, basePremium * 0.05) : 0;
        
        const ncbDiscount = (basePremium + zeroDepCost + engineCost) * ncbPercent;
        const subtotal = basePremium + zeroDepCost + roadsideCost + engineCost - ncbDiscount;
        const gst = subtotal * 0.18;
        
        total = Math.max(0, subtotal + gst);
        breakdownText += `Base premium: ₹ ${basePremium.toFixed(2)}<br/>Zero-dep: ₹ ${zeroDepCost.toFixed(2)}<br/>Engine: ₹ ${engineCost.toFixed(2)}<br/>Roadside: ₹ ${roadsideCost.toFixed(2)}<br/>NCB discount: -₹ ${ncbDiscount.toFixed(2)}<br/>GST (18%): ₹ ${gst.toFixed(2)}`;
      }

      const breakdown = document.getElementById('motorBreakdown');
      if (breakdown) breakdown.innerHTML = breakdownText;
      updateText('motorResult', total > 0 ? `₹ ${total.toFixed(2)}` : '-');
    });
  }

  // --- SME INSURANCE CALCULATOR ENGINE ---
  // Centralized single risk calculations function to eliminate duplication
  const calculateSmeRiskFactor = () => {
    const policyType = document.getElementById('smePolicyType')?.value || 'fire';
    const biDays = getNumValue('smeBIDays');

    let factor = 1;
    const maps = {
      construction: { nonCombustible: 0.9, mixed: 1.0, combustible: 1.2 },
      occupancy: { low: 0.9, medium: 1.1, high: 1.3 },
      safety: { advanced: 0.85, standard: 1.0, basic: 1.15 },
      location: { low: 0.95, medium: 1.1, high: 1.25 },
      claims: { zero: 0.9, few: 1.1, many: 1.3 },
      deductible: { low: 1.1, medium: 1.0, high: 0.9 },
      goods: { normal: 0.9, fragile: 1.2, hazardous: 1.4 },
      transit: { road: 1.0, rail: 0.95, sea: 0.9, air: 1.2 },
      route: { low: 0.95, medium: 1.1, high: 1.3 },
      packaging: { premium: 0.9, standard: 1.0, basic: 1.15 },
      liability: { low: 0.95, medium: 1.1, high: 1.25 },
      footfall: { low: 0.95, medium: 1.1, high: 1.2 },
      equipment: { new: 0.95, aged: 1.15 }
    };

    factor *= maps.construction[document.getElementById('smeConstruction')?.value] || 1;
    factor *= maps.occupancy[document.getElementById('smeOccupancy')?.value] || 1;
    factor *= maps.safety[document.getElementById('smeSafety')?.value] || 1;
    factor *= maps.location[document.getElementById('smeLocation')?.value] || 1;
    factor *= maps.claims[document.getElementById('smeClaims')?.value] || 1;
    factor *= maps.deductible[document.getElementById('smeDeductible')?.value] || 1;
    factor *= maps.equipment[document.getElementById('smeEquipment')?.value] || 1;

    if (policyType === 'marine') {
      factor *= maps.goods[document.getElementById('smeGoodsType')?.value] || 1;
      factor *= maps.transit[document.getElementById('smeTransitMode')?.value] || 1;
      factor *= maps.route[document.getElementById('smeRouteRisk')?.value] || 1;
      factor *= maps.packaging[document.getElementById('smePackaging')?.value] || 1;
    }
    if (policyType === 'hotel' || policyType === 'business') {
      factor *= maps.liability[document.getElementById('smePublicLiability')?.value] || 1;
      factor *= maps.footfall[document.getElementById('smeFootfall')?.value] || 1;
    }
    if (biDays > 0) {
      factor *= 1 + Math.min(0.35, (biDays / 365) * 0.2);
    }
    return factor;
  };

  // SME Calculate Event
  const smeCalcBtn = document.getElementById('smeCalcBtn');
  if (smeCalcBtn) {
    smeCalcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const sumInsured = getNumValue('smeSumInsured');
      const policyType = document.getElementById('smePolicyType')?.value || 'fire';
      const defaultRate = policyType === 'fire' ? 0.0025 : (policyType === 'marine' ? 0.0015 : 0.0035);
      const baseRate = (getNumValue('smeBaseRate') / 100) || defaultRate;
      const discount = Math.max(0, Math.min(100, getNumValue('smeDiscount'))) / 100;
      const minP = Math.max(0, getNumValue('smeMinPremium'));
      const freq = document.getElementById('smeFrequency')?.value || 'annual';

      const riskFactor = calculateSmeRiskFactor();
      const rawPremium = sumInsured * baseRate * riskFactor;
      const premiumAfterDiscount = Math.max(0, rawPremium * (1 - discount));
      
      let premium = Math.max(minP, premiumAfterDiscount);
      if (freq === 'monthly') premium /= 12;

      const breakdown = document.getElementById('smeBreakdown');
      if (breakdown) {
        breakdown.innerHTML = `Policy: ${policyType.toUpperCase()}<br/>
          Sum insured: ₹ ${sumInsured.toFixed(2)}<br/>
          Base rate: ${(baseRate * 100).toFixed(3)}%<br/>
          Risk factor: ${riskFactor.toFixed(2)}<br/>
          Premium before discount: ₹ ${rawPremium.toFixed(2)}<br/>
          Discount: ${(discount * 100).toFixed(1)}%<br/>
          Minimum premium: ₹ ${minP.toFixed(2)}<br/>
          Frequency: ${freq}`;
      }
      
      const suffix = freq === 'monthly' ? ' / month' : ' / year';
      updateText('smeResult', premium > 0 ? `₹ ${premium.toFixed(2)}${suffix}` : '-');
    });
  }

  // SME Learn Factor Event (Now cleanly references the exact same logic engine)
  const learnSmeFactor = document.getElementById('learnSmeFactor');
  if (learnSmeFactor) {
    learnSmeFactor.addEventListener('click', (e) => {
      e.preventDefault();
      const factor = calculateSmeRiskFactor();
      const disp = document.getElementById('smeFactorDisplay');
      if (disp) {
        disp.textContent = factor.toFixed(2);
        disp.dataset.factor = factor;
      }
    });
  }
});