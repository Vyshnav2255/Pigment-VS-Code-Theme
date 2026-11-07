// Keeps the interface (product) icon theme in step with the file icon theme:
// picking "Pigment <Library>" as File Icon Theme also selects "Pigment <Library> UI".
// Turn off with "pigment.syncInterfaceIcons": false (the old "pitchBlack.syncInterfaceIcons" key is still honoured).
const vscode = require('vscode');

function syncEnabled(cfg) {
  const v = cfg.inspect('pigment.syncInterfaceIcons');
  const set = v && (v.workspaceFolderValue ?? v.workspaceValue ?? v.globalValue);
  if (set !== undefined) return set;
  return cfg.get('pitchBlack.syncInterfaceIcons', true);
}

function sync(context) {
  const cfg = vscode.workspace.getConfiguration();
  if (!syncEnabled(cfg)) return;
  const fileTheme = cfg.get('workbench.iconTheme');
  if (typeof fileTheme !== 'string' || !fileTheme.startsWith('pigment-')) return;
  const productThemes = (context.extension.packageJSON.contributes.productIconThemes || []).map((t) => t.id);
  const target = `${fileTheme}-ui`;
  if (!productThemes.includes(target)) return;
  if (cfg.get('workbench.productIconTheme') === target) return;
  cfg.update('workbench.productIconTheme', target, vscode.ConfigurationTarget.Global);
}

function activate(context) {
  sync(context);
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('workbench.iconTheme') || e.affectsConfiguration('pigment.syncInterfaceIcons')
      || e.affectsConfiguration('pitchBlack.syncInterfaceIcons')) sync(context);
  }));
}

module.exports = { activate, deactivate() {} };
