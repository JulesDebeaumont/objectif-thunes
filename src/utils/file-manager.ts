import { DIRECTORY_EVOLUTION } from 'src/utils/evolution-manager'
import { DIRECTORY_THUNE_CONFIG } from 'src/utils/thune-config-manager'

const { exists, createDir, readTextFile, writeTextFile, removeFile, readDir, removeDir, BaseDirectory } = window.__TAURI__.fs;

export async function checkIfPathExists(path: string) {
    return await exists(path, { dir: BaseDirectory.Resource })
}

async function createDirInBaseDirectory(dirname: string) {
    await createDir(dirname, { dir: BaseDirectory.Resource })
}

export async function readJSONFile(path: string, absolute = false) {
    const fileData = await readTextFile(path, { dir: (absolute ? null : BaseDirectory.Resource) })
    if (fileData.length > 0) {
        return JSON.parse(fileData)
    } else {
        return []
    }
}

export async function createJSONFile(path: string, content: string) {
    
    await writeTextFile(path, JSON.parse(JSON.stringify(content)), { dir: BaseDirectory.Resource })
}

export async function deleteJSONFile(path: string) {
    await removeFile(path, { dir: BaseDirectory.Resource })
}

export async function getFilesFromDirectory(directoryName: string) {
    return await readDir(directoryName, { dir: BaseDirectory.Resource })
}

export async function checkOrCreateAppDataFolder() {
    if (await checkIfPathExists(DIRECTORY_EVOLUTION) === false) {
        await createDirInBaseDirectory(DIRECTORY_EVOLUTION)
    }
    if (await checkIfPathExists(DIRECTORY_THUNE_CONFIG) === false) {
        await createDirInBaseDirectory(DIRECTORY_THUNE_CONFIG)
    }
}

export async function deleteAllResourceFolder() {
    await removeDir(DIRECTORY_THUNE_CONFIG, { dir: BaseDirectory.Resource, recursive: true })
    await removeDir(DIRECTORY_EVOLUTION, { dir: BaseDirectory.Resource, recursive: true })
}
