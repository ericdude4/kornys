import { InlineError } from '@shopify/polaris';
import { capitalize } from '../utils';

type InlineApiErrorsArgs = {
    apiErrors: any,
    scope: string
}

export default function InlineApiErrors({ apiErrors, scope }: InlineApiErrorsArgs) {
    const errorMarkup = Object.keys(apiErrors).map((key: string, index: number) => {
        return <InlineError message={capitalize(key) + " " + apiErrors[key][0]} fieldID={scope + '_' + key} key={scope + '_error_' + index} />
    })

    return (<>{errorMarkup}</>);
}
