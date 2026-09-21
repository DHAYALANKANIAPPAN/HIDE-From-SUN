"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printValidationResult = printValidationResult;
const colors_1 = require("colors");
function getColor(score) {
    switch (score.status) {
        case 'PASS': return (0, colors_1.green)(score.printValue);
        case 'WARN': return (0, colors_1.yellow)(score.printValue);
        case 'FAIL': return (0, colors_1.red)(score.printValue);
        default: return score.printValue;
    }
}
function printValidationResult(validationResult, log) {
    log.info('');
    log.info('Check the full PageSpeed Insights report at:');
    log.info(`- ${validationResult.psiWebUrl}`);
    log.info('');
    const performanceValue = getColor(validationResult.scores.performance);
    const pwaValue = getColor(validationResult.scores.pwa);
    const overallStatus = validationResult.status === 'PASS' ?
        (0, colors_1.green)(validationResult.status) : (0, colors_1.red)(validationResult.status);
    const accessibilityValue = validationResult.scores.accessibility.printValue;
    const lcpValue = getColor(validationResult.scores.largestContentfulPaint);
    const fidValue = getColor(validationResult.scores.firstInputDelay);
    const clsValue = getColor(validationResult.scores.cumulativeLayoutShift);
    log.info('');
    log.info((0, colors_1.underline)('Quality Criteria scores'));
    log.info(`Lighthouse Performance score: ................... ${performanceValue}`);
    log.info(`Lighthouse PWA check: ........................... ${pwaValue}`);
    log.info('');
    log.info((0, colors_1.underline)('Web Vitals'));
    log.info(`Largest Contentful Paint (LCP) .................. ${lcpValue}`);
    log.info(`Maximum Potential First Input Delay (Max FID) ... ${fidValue}`);
    log.info(`Cumulative Layout Shift (CLS) ................... ${clsValue}`);
    log.info('');
    log.info((0, colors_1.underline)('Other scores'));
    log.info(`Lighthouse Accessibility score................... ${accessibilityValue}`);
    log.info('');
    log.info((0, colors_1.underline)('Summary'));
    log.info((0, colors_1.bold)(`Overall result: ................................. ${overallStatus}`));
}
