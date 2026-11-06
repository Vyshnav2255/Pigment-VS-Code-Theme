// Keeps the interface (product) icon theme in step with the file icon theme:
// picking "Pitch Black <Pack>" as File Icon Theme also selects "Pitch Black <Pack> UI".
// Turn off with "pitchBlack.syncInterfaceIcons": false.
const vscode = require('vscode');

function sync(context) {
  const cfg = vscode.workspace.getConfiguration();
  if (!cfg.get('pitchBlack.syncInterfaceIcons', true)) return;
  const fileTheme = cfg.get('workbench.iconTheme');
  if (typeof fileTheme !== 'string' || !fileTheme.startsWith('pitch-black-')) return;
  const productThemes = (context.extension.packageJSON.contributes.productIconThemes || []).map((t) => t.id);
  const target = `${fileTheme}-ui`;
  if (!productThemes.includes(target)) return;
  if (cfg.get('workbench.productIconTheme') === target) return;
  cfg.update('workbench.productIconTheme', target, vscode.ConfigurationTarget.Global);
}

function activate(context) {
  sync(context);
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('workbench.iconTheme') || e.affectsConfiguration('pitchBlack.syncInterfaceIcons')) sync(context);
  }));
}

module.exports = { activate, deactivate() {} };
