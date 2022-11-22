import { frontEndContractsFile, frontEndAbiFile } from "../helper-hardhat-config"
import fs from "fs"
import {DeployFunction} from "hardhat-deploy/types"
import {HardhatRuntimeEnvironment} from "hardhat/types"

const updateUI: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
  ) {
    const { network, ethers } = hre
    const chainId = network.config.chainId?.toString() ?? "31337"


    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        const fundMe = await ethers.getContract("Raffle")
        const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
        const abi = fundMe.interface.format(ethers.utils.FormatTypes.json) as string
        if (chainId in contractAddresses) {
            if (!contractAddresses[network.config.chainId!].includes(fundMe.address)) {
                contractAddresses[network.config.chainId!].push(fundMe.address)
            }
        } else {
            contractAddresses[network.config.chainId!] = [fundMe.address]
        }
        fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
        fs.writeFileSync(frontEndAbiFile, abi)
        console.log("Front end written!")
    }
}
export default updateUI
updateUI.tags = ["all", "frontend"]
