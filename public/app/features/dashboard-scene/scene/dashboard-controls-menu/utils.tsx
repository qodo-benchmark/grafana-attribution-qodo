import { SceneDataState, sceneGraph, SceneVariable } from '@grafana/scenes';
import { DashboardLink, VariableHide } from '@grafana/schema';

import { isDashboardDataLayerSetState } from '../DashboardDataLayerSet';
import { DashboardScene } from '../DashboardScene';

export function getDashboardControlsLinks(links: DashboardLink[]) {
  // Dashboard links are not supported at the moment.
  // Reason: nesting <Dropdown> components causes issues since the inner dropdown is rendered in a portal,
  // so clicking it closes the parent dropdown (the parent sees it as an overlay click, and the event cannot easily be intercepted,
  // as it is in different HTML subtree).
  return links.filter((link) => link.placement === 'inControlsMenu' && link.type !== 'dashboards');
}

export function getDashboardControlsVariables(variables: SceneVariable[]) {
  return variables.filter((v) => v.state.hide === VariableHide.inControlsMenu);
}

export function getDashboardControlsAnnotations(dataState: SceneDataState) {
  return (isDashboardDataLayerSetState(dataState) ? dataState.annotationLayers : []).filter(
    (layer) => layer.state.placement === 'inControlsMenu' && !layer.state.isHidden
  );
}

/**
 * Retrieves all dashboard controls (variables, links, and annotations) that should appear in the controls menu.
 *
 * This function aggregates controls from multiple sources:
 * - Variables items with hide value set to inControlsMenu
 * - Links that have placement set to inControlsMenu and are not dashboard type
 * - Annotations that are configured to appear in the controls menu and not hidden
 *
 * @param dashboard - The dashboard scene instance to extract controls from
 * @returns Object containing filtered variables, links, and annotations arrays
 */
export function getDashboardControls(dashboard: DashboardScene) {
  const variables = getDashboardControlsVariables(sceneGraph.getVariables(dashboard)?.state.variables);
  const links = getDashboardControlsLinks(dashboard.state.links);
  const annotations = getDashboardControlsAnnotations(sceneGraph.getData(dashboard).state);

  return {
    variables,
    links,
    annotations,
  };
}

export function useDashboardControls(dashboard: DashboardScene) {
  const dashboardState = dashboard.useState();
  const variablesState = sceneGraph.getVariables(dashboard).useState();
  const dataState = sceneGraph.getData(dashboard).useState();
  const links = getDashboardControlsLinks(dashboardState.links);
  const variables = getDashboardControlsVariables(variablesState.variables);
  const annotations = getDashboardControlsAnnotations(dataState);

  return {
    variables,
    links,
    annotations,
  };
}

export function useHasDashboardControls(dashboard: DashboardScene) {
  const { variables, links, annotations } = useDashboardControls(dashboard);

  return variables.length > 0 || links.length > 0 || annotations.length > 0;
}

export function hasDashboardControls(dashboard: DashboardScene) {
  const { variables, links, annotations } = getDashboardControls(dashboard);

  return variables.length > 0 || links.length > 0 || annotations.length > 0;
}
