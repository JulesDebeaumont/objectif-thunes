import { IThuneConfig } from 'src/components/models'
import { checkIfPathExists, readJSONFile, createJSONFile, deleteJSONFile } from 'src/utils/file-manager'

export const DIRECTORY_THUNE_CONFIG = 'thune_config'
const FILENAME_THUNE_CONFIG = 'default'
const FILE_EXTENSION_THUNE_CONFIG = 'json'

function getThuneConfigPath() {
    return DIRECTORY_THUNE_CONFIG + '\\' + FILENAME_THUNE_CONFIG + '.' + FILE_EXTENSION_THUNE_CONFIG
}

async function thuneConfigFileExist(): Promise<boolean> {
    return await checkIfPathExists(getThuneConfigPath())
}

async function createThuneConfigFile() {
    await createJSONFile(getThuneConfigPath(), '')
}

export async function writeThuneConfig(thuneConfig: IThuneConfig) {
    if (await thuneConfigFileExist() === false) {
        await createThuneConfigFile()
    }
    await createJSONFile(getThuneConfigPath(), JSON.stringify(thuneConfig))
}

export async function deleteThuneConfig() {
    if (await thuneConfigFileExist() === false) {
        return
    }
    await deleteJSONFile(getThuneConfigPath())
}

export async function readThuneConfig() {
    if (await thuneConfigFileExist() === false) {
        return null
    }
    return await readJSONFile(getThuneConfigPath())
}
