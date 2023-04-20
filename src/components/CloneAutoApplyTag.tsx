import { Text, AlphaStack, ButtonGroup, Button, LegacyStack, Tag, TextField } from '@shopify/polaris';
import { useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import { storeHost } from '../utils';
import { useCallback, useState } from 'react';


export default function CloneAutoApplyTag() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();

    const buildTagList = (store: any) => {
        let currentAutoApplyTags = store.tag_based_actions.add_tags_to_cloned_products ? store.tag_based_actions.add_tags_to_cloned_products : ""
        return currentAutoApplyTags.split(",")
    }

    const [currentTags, setCurrentTags] = useState<string[]>(buildTagList(store));

    const [inputValue, setInputValue] = useState('');

    const handleTextFieldChange = useCallback(
        (value: string) => setInputValue(value),
        [],
    );

    const updateRemoteCloneTags = async (newTags: string[]) => {
        await post("/stores/" + storeHost(store.url), { tag_based_actions: { add_tags_to_cloned_products: newTags.join(",") } })
            .then((store) => {
                setCurrentTags(buildTagList(store))
                revalidator.revalidate()
            })
    }

    const addTag = useCallback(() => {
        updateRemoteCloneTags([...currentTags].concat(inputValue))
        setInputValue('')
    }, [inputValue])

    const removeTag = useCallback(
        (tag: string) => () => {
            const tags = [...currentTags];
            tags.splice(tags.indexOf(tag), 1);

            updateRemoteCloneTags(tags)
        },
        [currentTags, inputValue],
    );

    const tagsMarkup = currentTags.map((tag) => {
        return (<Tag key={`option-${tag}`} onRemove={removeTag(tag)}>{tag}</Tag>)
    });

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Add tags to products cloned from {storeHost(store.url)}
            </Text>

            <Text as="p">
                Synkro can automatically add tags to products which are cloned from the current store ({store.url}) into another connected store. Tags will only be added to newly cloned products.
            </Text>

            {currentTags.length > 0 ? (
                <AlphaStack gap="2">
                    <Text variant="headingSm" as="h6">
                        Currently adding tags to cloned products:
                    </Text>
                    <LegacyStack>{tagsMarkup}</LegacyStack>
                </AlphaStack>
            ) : null}


            <TextField
                label="New tag"
                value={inputValue}
                onChange={handleTextFieldChange}
                maxLength={255}
                autoComplete="off"
                showCharacterCount
            />

            <ButtonGroup>
                <Button primary onClick={addTag}>Save</Button>
            </ButtonGroup>
        </AlphaStack >
    );
}
