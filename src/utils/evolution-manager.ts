import { IEvolution } from 'src/components/models'
import { checkIfPathExists, readJSONFile, createJSONFile, deleteJSONFile, getFilesFromDirectory } from 'src/utils/file-manager'

export const DIRECTORY_EVOLUTION = 'evolutions'
const FILENAME_EVOLUTION = 'evolution'
const FILE_EXTENSION_EVOLUTION = 'json'

function getDefaultContentEvolution(id: string) {
    return `{
    "id": "${id}",
    "createdAt": "${new Date()}",
    "data": []
}`
}

function getEvolutionFilePath(id: string) {
    return DIRECTORY_EVOLUTION + '\\' + FILENAME_EVOLUTION + id + '.' + FILE_EXTENSION_EVOLUTION
}

async function evolutionFileExist(id: string): Promise<boolean> {
    return await checkIfPathExists(getEvolutionFilePath(id))
}

export async function createEvolutionFile(id: string) {
    await createJSONFile(getEvolutionFilePath(id), getDefaultContentEvolution(id))
}

export async function writeEvolutionFile(id: string, evolution: IEvolution) {
    if (await evolutionFileExist(id) === false) {
        await createEvolutionFile(id)
    }
    await createJSONFile(getEvolutionFilePath(id), JSON.stringify(evolution))
}

export async function deleteEvolution(id: string) {
    if (await evolutionFileExist(id) === false) {
        return
    }
    await deleteJSONFile(getEvolutionFilePath(id))
}

export async function readEvolutionById(id: string) {
    if (await evolutionFileExist(id) === false) {
        return ''
    }
    return await readJSONFile(getEvolutionFilePath(id))
}

export async function readAllEvolutions() {
    const allEvolutions: IEvolution[] = []
    const files = await getFilesFromDirectory(DIRECTORY_EVOLUTION)
    for (const file of files) {
        allEvolutions.push(await readJSONFile(file.path, true))
    }
    return allEvolutions
}
