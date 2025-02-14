import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { EntityDescription } from 'components/Entities/EntityDescription';
import { useProject } from 'components/hooks/useProjects';
import { useChartState } from 'components/hooks/useChartState';
import { ResourceIdentifier } from 'models/Common/types';
import { Box, Grid } from '@material-ui/core';
import { LoadingSpinner } from 'components/common';
import { FeatureFlag, useFeatureFlag } from 'basics/FeatureFlags';
import { entitySections } from './constants';
import { EntityDetailsHeader } from './EntityDetailsHeader';
import { EntityInputs } from './EntityInputs';
import { EntityExecutions } from './EntityExecutions';
import { EntitySchedules } from './EntitySchedules';
import { EntityVersions } from './EntityVersions';
import { EntityExecutionsBarChart } from './EntityExecutionsBarChart';

const useStyles = makeStyles((theme: Theme) => ({
  entityDetailsWrapper: {
    minHeight: '100vh',
  },
  metadataContainer: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  descriptionContainer: {
    flex: '2 1 auto',
    marginRight: theme.spacing(2),
  },
  executionsContainer: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    margin: `0`,
    flexBasis: theme.spacing(80),
  },
  versionsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  schedulesContainer: {
    flex: '1 2 auto',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

interface EntityDetailsProps {
  id: ResourceIdentifier;
}

/**
 * A view which optionally renders description, schedules, executions, and a
 * launch button/form for a given entity. Note: not all components are suitable
 * for use with all entities (not all entities have schedules, for example).
 * @param id
 */
export const EntityDetails: React.FC<EntityDetailsProps> = ({ id }) => {
  const sections = entitySections[id.resourceType];
  const [project] = useProject(id.project);
  const styles = useStyles();
  const { chartIds, onToggle, clearCharts } = useChartState();

  const isBreadcrumbsFlag = useFeatureFlag(FeatureFlag.breadcrumbs);

  return (
    <Grid container direction="column" className={styles.entityDetailsWrapper}>
      {!project?.id && <LoadingSpinner />}
      {project?.id && (
        <>
          <Box px={isBreadcrumbsFlag ? 0 : 2}>
            <EntityDetailsHeader
              id={id}
              launchable={!!sections.launch}
              project={project}
            />
          </Box>
          <div className={styles.metadataContainer}>
            {sections.description && (
              <div className={styles.descriptionContainer}>
                <EntityDescription id={id} />
              </div>
            )}
            {!sections.inputs && sections.schedules && (
              <div className={styles.schedulesContainer}>
                <EntitySchedules id={id} />
              </div>
            )}
          </div>

          {!!sections.inputs && (
            <div className={styles.inputsContainer}>
              <EntityInputs id={id} />
            </div>
          )}

          {!!sections.versions && (
            <div className={styles.versionsContainer}>
              <EntityVersions id={id} />
            </div>
          )}

          <EntityExecutionsBarChart
            onToggle={onToggle}
            chartIds={chartIds}
            id={id}
          />
          {!sections.executions && <LoadingSpinner />}
          {sections.executions && (
            <div className={styles.executionsContainer}>
              <EntityExecutions
                chartIds={chartIds}
                id={id}
                clearCharts={clearCharts}
              />
            </div>
          )}
        </>
      )}
    </Grid>
  );
};
