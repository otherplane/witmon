#!/usr/bin/env python3

import argparse
from brother_ql.backends import available_backends
from brother_ql.backends.helpers import send
from brother_ql.conversion import convert
from brother_ql.devicedependent import label_sizes, label_type_specs, models
from brother_ql.raster import BrotherQLRaster
import glob
from PIL import Image
from typing import List, Tuple


def load_image(path: str, resolution: Tuple[int, int]):
    with Image.open(path) as image:
        extended = Image.new('1', (round(resolution[0] * 1.4), round(resolution[1] * 1.4)), 1)
        extended.paste(image, (round(resolution[0] * 0.2), 0))

        return extended.resize(resolution)


def load_images(input_dir: str, resolution: Tuple[int, int]):
    files = glob.glob(f'{input_dir}/*.png')

    return [load_image(file, resolution) for file in files]


def ql_bulk_print(images: List[str], label: str, backend: str, model: str, printer: str, **kwargs):
    qlr = BrotherQLRaster(model)
    qlr.exception_on_warning = True
    instructions = convert(qlr, images, label, hq=True, **kwargs)
    send(instructions, printer_identifier=printer, backend_identifier=backend, blocking=True)


def ql_resolution(label: str):
    label_specs = label_type_specs[label]
    resolution = label_specs['dots_printable']

    return resolution


def main(config):
    resolution = ql_resolution(config.label)
    images = load_images(config.input_dir, resolution)
    ql_bulk_print(images[:-1], config.label, config.backend, config.model, config.printer, cut=False)
    ql_bulk_print(images[-1:], config.label, config.backend, config.model, config.printer, cut=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate QR codes for WittyCreatures at Liscon 2021')
    parser.add_argument('--input_dir', help='path for QR image input', default='./qr_codes/')
    parser.add_argument('--label', choices=label_sizes, help='type of DK label used for printing', default='23x23')
    parser.add_argument('--backend', choices=available_backends, help='Forces the use of a specific backend',
                        default='pyusb')
    parser.add_argument('--model', choices=models, help='Specify the printer model', default='QL-800')
    parser.add_argument('--printer', help='Specify the identifier or address of the printer')
    args = parser.parse_args()
    main(args)
