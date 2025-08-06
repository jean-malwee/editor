import { toast } from '@mlw-packages/react-components';
import { match, P } from 'ts-pattern';

export const errorMessage = (e: unknown): string => {
  return match(e)
    .with({ message: P.string }, ({ message }) => message)
    .with(
      P.when((d) => typeof d === 'object' && 'toString' in (d as object)),
      (data: object) => data.toString(),
    )
    .otherwise(() => 'Unknown error');
};

export const displayError = (e: unknown) => toast.error(errorMessage(e));
