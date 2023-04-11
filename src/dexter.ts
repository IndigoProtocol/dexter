import { Minswap } from './dex/minswap';
import { BaseProvider } from './provider/base-provider';
import { AvailableDexs, DexterConfig } from './types/global';
import { TokenRegistry } from './services/token-registry';
import { DexterRequest } from './dexter-request';

export class Dexter {

    private provider: BaseProvider;
    private config: DexterConfig;

    private availableDexes: AvailableDexs;
    private tokenRegistry: TokenRegistry;

    static new(provider: BaseProvider, config?: DexterConfig): Dexter {
        let dexter = new this();

        dexter.switchProvider(provider);
        dexter.setConfig(config);
        dexter.tokenRegistry = new TokenRegistry();
        dexter.availableDexes = {
            [Minswap.name]: new Minswap(),
        };

        return dexter;
    }

    setConfig(config: DexterConfig = {}): Dexter {
        this.config = config;

        return this;
    }

    /**
     * Switch to a new provider.
     */
    switchProvider(provider: BaseProvider): Dexter {
        this.provider = provider;

        return this;
    }

    newRequest(): DexterRequest {
        return new DexterRequest(
            this.provider,
            this.config,
            this.availableDexes,
        );
    }

}